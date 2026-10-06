import { createClient } from '@supabase/supabase-js';
import { getConnectionKey } from './usePresence';

/* ====================================================================
   Real cross-user presence using Supabase Realtime Presence.
   No database table needed.

   1. npm i @supabase/supabase-js
   2. Add to .env:
        VITE_SUPABASE_URL=https://xxxx.supabase.co
        VITE_SUPABASE_ANON_KEY=your-anon-key
   3. In main.jsx, BEFORE rendering the app:

        import { setPresenceTransport } from './usePresence';
        import { createSupabaseTransport } from './presenceSupabase';

        setPresenceTransport(
          createSupabaseTransport({
            url: import.meta.env.VITE_SUPABASE_URL,
            anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          })
        );
   ==================================================================== */

export function createSupabaseTransport({ url, anonKey, channelName = 'duoclash-presence' }) {
  const supabase = createClient(url, anonKey);
  const key = getConnectionKey();

  let channel = null;
  let callback = null;
  let ready = false;
  let latest = null;

  const emit = () => {
    if (!channel || !callback) return;
    const list = [];
    Object.entries(channel.presenceState()).forEach(([peerKey, metas]) => {
      metas.forEach((m) => {
        list.push({ key: peerKey, id: m.id, name: m.name, avatar: m.avatar, status: m.status });
      });
    });
    callback(list);
  };

  return {
    subscribe(fn) {
      callback = fn;
      emit();
    },
    join(meta) {
      latest = meta;
      if (channel) return;
      channel = supabase.channel(channelName, { config: { presence: { key } } });
      channel.on('presence', { event: 'sync' }, emit).subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          ready = true;
          await channel.track(latest);
        }
      });
    },
    update(meta) {
      latest = meta;
      if (channel && ready) channel.track(meta);
    },
    leave() {
      if (!channel) return;
      const current = channel;
      channel = null;
      ready = false;
      current.untrack();
      supabase.removeChannel(current);
      if (callback) callback([]);
    },
  };
}