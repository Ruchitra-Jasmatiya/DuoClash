import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swords, Users, Code, Trophy, Gift, Crown, Shield, Link2 } from 'lucide-react';
import { resolveUser, usePresence, usePresenceTracker } from './usePresence';
import './Home.css';

/* ------------------------------------------------------------------
   BACKGROUND IMAGE
   Automatically finds your image anywhere inside src/assets whose file
   name contains "background" (e.g. src/assets/images/background.png).
   No path to maintain. To use a fixed path instead, replace these two
   lines with:  import bgImage from '../assets/images/background.png';
------------------------------------------------------------------- */
const backgroundFiles = import.meta.glob('/src/assets/**/*background*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const BACKGROUND_SRC = Object.values(backgroundFiles)[0] || null;

/* ------------------------------------------------------------------
   EASY-TO-EDIT DATA
------------------------------------------------------------------- */

// Put your clan flag image in /public/images/ (or change this path / import it).
const CLAN_FLAG_SRC = '/images/clan-flag.png';

// How many online coders to list before showing "+N more".
const MAX_VISIBLE_MEMBERS = 6;

const STEPS = [
  { number: '01', icon: Users,  title: 'Create / Join',       text: 'Start a battle or join one using a battle link.' },
  { number: '02', icon: Swords, title: 'Enter Battleground',  text: 'Both players enter the same battle.' },
  { number: '03', icon: Code,   title: 'Code & Solve',        text: 'Solve the same DSA challenge against the clock.' },
  { number: '04', icon: Trophy, title: 'Defeat Your Rival',   text: 'Complete the challenge and win the battle.' },
  { number: '05', icon: Gift,   title: 'Claim Your Reward',   text: 'Victory unlocks your battle reward.' },
];

const STATUS_LABEL = { online: 'Online', battle: 'In Battle' };

// Leaderboard preview (replace with real data from your leaderboard later).
const DUELISTS = [
  { name: 'Ruchitra', xp: 4820, avatar: null },
  { name: 'Sakshi',   xp: 4310, avatar: null },
  { name: 'Apeksha',  xp: 3980, avatar: null },
  { name: 'Muskan',   xp: 3560, avatar: null },
  { name: 'Gautam',   xp: 3120, avatar: null },
];

/* ------------------------------------------------------------------
   HELPERS
------------------------------------------------------------------- */

// Adds `is-visible` once the element scrolls into view (runs once).
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

const groupClass = (visible) => `reveal-group${visible ? ' is-visible' : ''}`;

// Same name always gets the same avatar colour.
const colorIndex = (name) =>
  [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 5;

function Avatar({ name, src, size = 'md' }) {
  return (
    <span className={`avatar avatar-${colorIndex(name)} avatar-${size}`} aria-hidden="true">
      {src ? <img src={src} alt="" /> : name.charAt(0).toUpperCase()}
    </span>
  );
}

/* ------------------------------------------------------------------
   PAGE

   Props
   - currentUser: optional { id, name, avatar } of the signed-in user.
                  If omitted, it is read from localStorage ("duoclash_user" / "user").
   - showNavbar:  set true only if you want the built-in navbar
                  (leave false when your app already renders its own).
------------------------------------------------------------------- */

export default function Home({ currentUser = null, showNavbar = false }) {
  const navigate = useNavigate();
  const goToBattle = () => navigate('/battle');

  // Live presence: announce this visitor, read everyone who is online.
  const user = useMemo(() => resolveUser(currentUser), [currentUser]);
  usePresenceTracker(user);
  const { members, guestCount, total } = usePresence();

  const visibleMembers = members.slice(0, MAX_VISIBLE_MEMBERS);
  const extraMembers = members.length - visibleMembers.length;

  const [howRef, howVisible] = useReveal();
  const [clanRef, clanVisible] = useReveal();
  const [duelRef, duelVisible] = useReveal();
  const [flagMissing, setFlagMissing] = useState(false);

  return (
    <div
      className="home-page"
      style={BACKGROUND_SRC ? { '--home-bg': `url("${BACKGROUND_SRC}")` } : undefined}
    >
      {/* ---------------- NAVBAR (optional) ---------------- */}
      {showNavbar && (
        <header className="home-nav">
          <Link to="/" className="nav-logo" aria-label="DUOCLASH home">
            <Swords size={22} strokeWidth={2.2} />
            <span>DUOCLASH</span>
          </Link>

          <nav className="nav-links" aria-label="Main">
            <Link to="/battle">Battle</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/profile">Profile</Link>
          </nav>
        </header>
      )}

      <main>
        {/* ---------------- HERO ---------------- */}
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="hero-label">Real-Time Coding Battles</p>

            <h1 id="hero-title" className="hero-title">
              Two Minds.
              <br />
              <span className="hero-title-accent">One Battle.</span>
            </h1>

            <p className="hero-text">
              Challenge your partner, solve the same DSA problem, code faster and win the battle.
            </p>

            <div className="hero-buttons">
              <button type="button" className="btn btn-create" onClick={goToBattle}>
                <Swords className="btn-icon" size={17} />
                Create Battle
              </button>
              <button type="button" className="btn btn-join" onClick={goToBattle}>
                <Link2 className="btn-icon" size={17} />
                Join Battle
              </button>
            </div>
          </div>
        </section>

        {/* ---------------- HOW IT WORKS ---------------- */}
        <section
          className={`how-it-works ${groupClass(howVisible)}`}
          ref={howRef}
          aria-labelledby="how-title"
        >
          <div className="parchment reveal-item">
            <h2 id="how-title" className="section-title">
              <span>How It Works</span>
            </h2>

            <ol className="steps-list">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <li
                    className="battle-step reveal-item"
                    style={{ '--i': i + 1 }}
                    key={step.number}
                  >
                    <div className="step-card">
                      <div className="emblem-wrap">
                        <span className="step-number">{step.number}</span>
                        <div className="emblem">
                          <div className="emblem-inner">
                            <Icon size={34} strokeWidth={1.9} />
                          </div>
                        </div>
                      </div>
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-text">{step.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <p className="parchment-tagline reveal-item" style={{ '--i': 6 }}>
              <span>Simple Steps. Epic Battles.</span>
            </p>
          </div>
        </section>

        {/* ---------------- CLAN + DUELISTS ---------------- */}
        <div className="community-grid">
          {/* JOIN THE CLAN */}
          <section
            className={`clan-section ${groupClass(clanVisible)}`}
            ref={clanRef}
            aria-labelledby="clan-title"
          >
            <div className="clan-panel panel reveal-item">
              {/* Flag: replace CLAN_FLAG_SRC at the top of this file */}
              <div className="clan-flag">
                <span className="flag-finial" />
                <span className="flag-pole" />
                <span className="flag-bar" />
                <div className="flag-cloth">
                  {flagMissing ? (
                    <div className="flag-placeholder">Your clan flag</div>
                  ) : (
                    <img
                      src={CLAN_FLAG_SRC}
                      alt="Clan flag"
                      onError={() => setFlagMissing(true)}
                    />
                  )}
                </div>
              </div>

              <div className="clan-main">
                <div className="panel-heading reveal-item" style={{ '--i': 1 }}>
                  <span className="heading-badge"><Shield size={20} /></span>
                  <h2 id="clan-title">Join the Clan</h2>
                </div>

                <p className="clan-motto reveal-item" style={{ '--i': 2 }}>
                  You are not fighting alone. Build your clan. Compete together.
                </p>

                <p className="clan-text reveal-item" style={{ '--i': 3 }}>
                  Build your clan, gather your coders, and compete against other students in the
                  DUOCLASH arena.
                </p>

                <div className="clan-buttons reveal-item" style={{ '--i': 4 }}>
                  <button type="button" className="btn btn-sm btn-create" onClick={goToBattle}>
                    Create Clan
                  </button>
                  <button type="button" className="btn btn-sm btn-join" onClick={goToBattle}>
                    Join Clan
                  </button>
                </div>

                {/* Live count of everyone on the site right now */}
                <div className="clan-online reveal-item" style={{ '--i': 5 }}>
                  {members.length > 0 && (
                    <div className="avatar-stack">
                      {members.slice(0, 3).map((m) => (
                        <Avatar key={m.id} name={m.name} src={m.avatar} size="sm" />
                      ))}
                    </div>
                  )}
                  <span className="online-count" aria-live="polite">
                    <i className="status-dot" />
                    {total} online now
                    {guestCount > 0 && ` · ${guestCount} ${guestCount === 1 ? 'guest' : 'guests'}`}
                  </span>
                </div>
              </div>

              {/* Live roster: signed-in coders who are on the site right now */}
              <ul className="clan-members" aria-label="Coders online now">
                {visibleMembers.length === 0 ? (
                  <li className="clan-empty">
                    No signed-in coders online yet. Sign up to appear here.
                  </li>
                ) : (
                  visibleMembers.map((member, i) => (
                    <li className="reveal-item" style={{ '--i': i + 2 }} key={member.id}>
                      <div className="member-row">
                        <Avatar name={member.name} src={member.avatar} />
                        <span className="member-name">
                          {member.name}
                          {user && member.id === user.id && <span className="you-tag">You</span>}
                        </span>
                        <span className={`member-status status-${member.status}`}>
                          <i className="status-dot" />
                          {STATUS_LABEL[member.status]}
                        </span>
                      </div>
                    </li>
                  ))
                )}
                {extraMembers > 0 && <li className="clan-more">+{extraMembers} more online</li>}
              </ul>
            </div>
          </section>

          {/* TOP DUELISTS */}
          <section
            className={`top-duelists ${groupClass(duelVisible)}`}
            ref={duelRef}
            aria-labelledby="duelists-title"
          >
            <div className="duelists-panel panel reveal-item">
              <div className="panel-heading reveal-item" style={{ '--i': 1 }}>
                <span className="heading-badge"><Crown size={20} /></span>
                <div>
                  <h2 id="duelists-title">Top Duelists</h2>
                  <p className="heading-sub">The best of the best.</p>
                </div>
              </div>

              <ol className="duelist-list">
                {DUELISTS.map((duelist, i) => (
                  <li className="reveal-item" style={{ '--i': i + 2 }} key={duelist.name}>
                    <div className={`duelist-row rank-${i + 1}`}>
                      <span className="duelist-rank">{i + 1}</span>
                      <Avatar name={duelist.name} src={duelist.avatar} />
                      <span className="duelist-name">{duelist.name}</span>
                      <span className="duelist-xp">{duelist.xp.toLocaleString('en-US')} XP</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
