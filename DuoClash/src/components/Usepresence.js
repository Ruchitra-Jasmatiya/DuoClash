import { useEffect, useMemo, useSyncExternalStore } from 'react';

/* ====================================================================
   DUOCLASH PRESENCE
   Shared "who is online" store. Used by Home.jsx AND Leaderboard.jsx,
   so both pages always show the same people and the same count.

   - usePresenceTracker(user, status)  -> announces "I'm here" (call on any page)
   - usePresence()                     -> { members, guestCount, total }
   - setPresenceTransport(transport)   -> plug in the real backend (see presenceSupabase.js)

   Out of the box it uses a local transport (BroadcastChannel) that works
   across tabs of the same browser, so you can test right away. For real
   visitors on different devices, plug in presenceSupabase.js.
   ==================================================================== */

const HEARTBEAT_MS = 5000;
const STALE_MS = 15000;
const LEAVE_GRACE_MS = 1500; // survives quick route changes (Home -> Leaderboard)
const MAX_NAME = 24;

/* ---------------- helpers ---------------- */

let memoryKey = null;

// One key per browser tab.
export function getConnectionKey() {
  if (memoryKey) return memoryKey;
  const fresh = () =>
    (typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID()) ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try {
    let key = sessionStorage.getItem('duoclash_conn');
    if (!key) {
      key = fresh();
      sessionStorage.setItem('duoclash_conn', key);
    }
    memoryKey = key;
  } catch {
    memoryKey = fresh();
  }
  return memoryKey;
}

const safeAvatar = (url) =>
  typeof url === 'string' && /^(https:\/\/|\/)/.test(url) ? url : null;

/**
 * Works out who the signed-in user is.
 * Priority: explicit prop -> ?as=Name (dev only, for testing) -> localStorage.
 * Returns { id, name, avatar } or null for a guest.
 */
export function resolveUser(explicit) {
  const normalize = (u) => {
    if (!u || typeof u !== 'object') return null;
    const name = u.name || u.username || u.displayName || null;
    if (!name) return null;
    const id = u.id ?? u._id ?? u.uid ?? u.email ?? name;
    return {
      id: String(id),
      name: String(name).slice(0, MAX_NAME),
      avatar: safeAvatar(u.avatar || u.photoURL || u.photo),
    };
  };

  const fromProp = normalize(explicit);
  if (fromProp) return fromProp;

  try {
    if (import.meta.env && import.meta.env.DEV) {
      const as = new URLSearchParams(window.location.search).get('as');
      if (as) return normalize({ id: `dev-${as}`, name: as });
    }
  } catch {
    /* ignore */
  }

  for (const key of ['duoclash_user', 'user', 'currentUser']) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      const found = normalize(parsed && parsed.user ? parsed.user : parsed);
      if (found) return found;
    } catch {
      /* ignore bad JSON */
    }
  }
  return null;
}

/* ---------------- local transport (same-browser tabs) ---------------- */

function createLocalTransport() {
  const key = getConnectionKey();
  const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('duoclash-presence');
  const peers = new Map();
  let me = null;
  let callback = null;
  let heartbeat = null;
  let sweeper = null;

  const publish = () => {
    if (!callback) return;
    const now = Date.now();
    const list = [];
    peers.forEach((peer, peerKey) => {
      if (now - peer.seen < STALE_MS) list.push({ key: peerKey, ...peer.meta });
    });
    if (me) list.push({ key, ...me });
    callback(list);
  };

  const send = (type) => {
    if (channel && me) channel.postMessage({ type, key, meta: me });
  };

  const sendBye = () => {
    if (channel) channel.postMessage({ type: 'bye', key });
  };

  if (channel) {
    channel.onmessage = ({ data }) => {
      if (!data || data.key === key) return;
      if (data.type === 'bye') {
        peers.delete(data.key);
      } else if (data.meta) {
        peers.set(data.key, { meta: data.meta, seen: Date.now() });
        if (data.type === 'hello') send('beat'); // tell the newcomer we're here
      }
      publish();
    };
  }

  return {
    subscribe(fn) {
      callback = fn;
      publish();
    },
    join(meta) {
      me = meta;
      send('hello');
      heartbeat = setInterval(() => send('beat'), HEARTBEAT_MS);
      sweeper = setInterval(publish, HEARTBEAT_MS);
      window.addEventListener('pagehide', sendBye);
      publish();
    },
    update(meta) {
      me = meta;
      send('beat');
      publish();
    },
    leave() {
      me = null;
      clearInterval(heartbeat);
      clearInterval(sweeper);
      window.removeEventListener('pagehide', sendBye);
      sendBye();
      publish();
    },
  };
}

/* ---------------- shared store ---------------- */

let transport = null;

const store = {
  connections: [],
  listeners: new Set(),
  refs: 0,
  subscribed: false,
  joined: false,
  leaveTimer: null,
};

// Call once at app start, BEFORE the first render, to use a real backend.
export function setPresenceTransport(nextTransport) {
  if (!store.subscribed) transport = nextTransport;
}

const getTransport = () => {
  if (!transport) transport = createLocalTransport();
  return transport;
};

function setConnections(list) {
  store.connections = list;
  store.listeners.forEach((listener) => listener());
}

function acquire(meta) {
  const t = getTransport();
  store.refs += 1;
  if (store.leaveTimer) {
    clearTimeout(store.leaveTimer);
    store.leaveTimer = null;
  }
  if (!store.subscribed) {
    store.subscribed = true;
    t.subscribe(setConnections);
  }
  if (store.joined) {
    t.update(meta);
  } else {
    t.join(meta);
    store.joined = true;
  }
}

function release() {
  store.refs = Math.max(0, store.refs - 1);
  if (store.refs === 0) {
    store.leaveTimer = setTimeout(() => {
      getTransport().leave();
      store.joined = false;
      store.leaveTimer = null;
    }, LEAVE_GRACE_MS);
  }
}

const subscribe = (listener) => {
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
};
const getSnapshot = () => store.connections;

/* ---------------- public hooks ---------------- */

/**
 * Announce this visitor. Call it on Home, Leaderboard, Battle...
 * user:   { id, name, avatar } from resolveUser(), or null for a guest (counted, but unnamed)
 * status: 'online' | 'battle'
 */
export function usePresenceTracker(user, status = 'online') {
  const id = user ? user.id : null;
  const name = user ? user.name : null;
  const avatar = user ? user.avatar : null;

  useEffect(() => {
    acquire({ id, name, avatar, status });
    return release;
  }, [id, name, avatar, status]);
}

function summarize(connections) {
  const byUser = new Map();
  let guestCount = 0;

  connections.forEach((c) => {
    if (c.name) {
      const id = String(c.id ?? c.name);
      const previous = byUser.get(id);
      const status = c.status === 'battle' || (previous && previous.status === 'battle') ? 'battle' : 'online';
      byUser.set(id, {
        id,
        name: String(c.name).slice(0, MAX_NAME),
        avatar: safeAvatar(c.avatar),
        status,
      });
    } else {
      guestCount += 1;
    }
  });

  const members = [...byUser.values()].sort((a, b) => a.name.localeCompare(b.name));
  return { members, guestCount, total: members.length + guestCount };
}

/** Read the live roster: { members: [{id,name,avatar,status}], guestCount, total } */
export function usePresence() {
  const connections = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return useMemo(() => summarize(connections), [connections]);
}