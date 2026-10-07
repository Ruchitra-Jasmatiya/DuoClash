import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Swords,
  Trophy,
  Flame,
  Zap,
  Shield,
  Target,
  User,
  Users,
  TrendingUp,
  TrendingDown,
  Award,
  BarChart2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Activity,
  Filter,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  Medal
} from 'lucide-react';
import './Dashboard.css';

/**
 * DUOCLASH Dashboard Component
 * Competitive Coding War Room & Command Center
 * 
 * Data Flow Architecture:
 * React Dashboard <---> LocalStorage / Demo Fallbacks <---> (Future: Django REST API + PostgreSQL)
 */

// ==========================================
// DEMO FALLBACK DATA STRUCTURES
// ==========================================

const DEFAULT_DEMO_USER = {
  id: 1,
  name: "Ruchitra",
  username: "ruchitra_dev",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  level: 12,
  xp: 1240,
  nextLevelXp: 2000,
  battleRating: 1482,
  rank: 27,
  previousRank: 30,
  clanName: "CodeSlayers",
  clanRank: 14,
  clanXp: 18450,
  clanMembers: 18,
  clanContribution: "1,240 XP"
};

const DEFAULT_DEMO_MATCHES = [
  {
    id: "DC-48291",
    playerId: 1,
    opponentId: 102,
    opponentName: "Sakshi",
    opponentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    problem: "Find the Missing Number",
    difficulty: "Easy",
    result: "win",
    playerScore: 100,
    opponentScore: 0,
    duration: "06:42",
    date: "2026-10-06",
    xpEarned: 100
  },
  {
    id: "DC-48285",
    playerId: 1,
    opponentId: 103,
    opponentName: "Rahul",
    opponentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    problem: "Valid Parentheses",
    difficulty: "Medium",
    result: "win",
    playerScore: 100,
    opponentScore: 45,
    duration: "11:15",
    date: "2026-10-05",
    xpEarned: 120
  },
  {
    id: "DC-48270",
    playerId: 1,
    opponentId: 104,
    opponentName: "Vikram",
    opponentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    problem: "LRU Cache Implementation",
    difficulty: "Hard",
    result: "loss",
    playerScore: 30,
    opponentScore: 100,
    duration: "18:20",
    date: "2026-10-04",
    xpEarned: 20
  },
  {
    id: "DC-48255",
    playerId: 1,
    opponentId: 105,
    opponentName: "Aanya",
    opponentAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    problem: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    result: "win",
    playerScore: 100,
    opponentScore: 20,
    duration: "09:30",
    date: "2026-10-03",
    xpEarned: 110
  },
  {
    id: "DC-48240",
    playerId: 1,
    opponentId: 106,
    opponentName: "Devansh",
    opponentAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    problem: "Two Sum",
    difficulty: "Easy",
    result: "win",
    playerScore: 100,
    opponentScore: 80,
    duration: "04:12",
    date: "2026-10-02",
    xpEarned: 90
  },
  {
    id: "DC-48222",
    playerId: 1,
    opponentId: 107,
    opponentName: "Priya",
    opponentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    problem: "Merge K Sorted Lists",
    difficulty: "Hard",
    result: "win",
    playerScore: 100,
    opponentScore: 60,
    duration: "21:05",
    date: "2026-10-01",
    xpEarned: 150
  }
];

const DEFAULT_DEMO_LEADERBOARD = [
  { rank: 1, id: 101, name: "Arjun Dev", username: "arjun_dev", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150", level: 28, wins: 142, losses: 18, winRate: 88, battleRating: 2450, xp: 18900 },
  { rank: 2, id: 108, name: "Siddharth", username: "sid_master", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150", level: 25, wins: 120, losses: 22, winRate: 84, battleRating: 2210, xp: 16400 },
  { rank: 3, id: 109, name: "Zara Khan", username: "zara_algo", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150", level: 24, wins: 112, losses: 25, winRate: 81, battleRating: 2100, xp: 15100 },
  { rank: 25, id: 110, name: "Karan", username: "karan_codes", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150", level: 14, wins: 40, losses: 15, winRate: 72, battleRating: 1520, xp: 1450 },
  { rank: 26, id: 111, name: "Meera", username: "meera_val", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150", level: 13, wins: 34, losses: 14, winRate: 70, battleRating: 1500, xp: 1420 },
  { rank: 27, id: 1, name: "Ruchitra", username: "ruchitra_dev", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250", level: 12, wins: 29, losses: 13, winRate: 69, battleRating: 1482, xp: 1240 },
  { rank: 28, id: 112, name: "Nikhil", username: "nikhil_c", avatar: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&q=80&w=150", level: 12, wins: 28, losses: 16, winRate: 63, battleRating: 1440, xp: 1190 },
  { rank: 29, id: 113, name: "Tanya", username: "tanya_coder", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150", level: 11, wins: 25, losses: 18, winRate: 58, battleRating: 1390, xp: 1120 }
];

const DEMO_ACHIEVEMENTS = [
  { id: "ach-1", name: "First Blood", description: "Win your first duel in DUOCLASH", icon: Trophy, progress: 100, unlocked: true },
  { id: "ach-2", name: "On Fire", description: "Achieve a 5-win streak", icon: Flame, progress: 100, unlocked: true },
  { id: "ach-3", name: "Veteran Duelist", description: "Complete 50 competitive battles", icon: Swords, progress: 84, unlocked: false },
  { id: "ach-4", name: "Speed Demon", description: "Solve a Hard DSA problem under 10 minutes", icon: Zap, progress: 100, unlocked: true },
  { id: "ach-5", name: "Top 50 Elite", description: "Reach Rank 50 or higher in Global Ladder", icon: Target, progress: 100, unlocked: true },
  { id: "ach-6", name: "Grandmaster Candidate", description: "Reach a Battle Rating of 1800", icon: Award, progress: 65, unlocked: false }
];

// Helper Functions
const calculateStats = (matches) => {
  if (!matches || matches.length === 0) {
    return { totalBattles: 0, wins: 0, losses: 0, winRate: 0, totalXpEarned: 0 };
  }
  const totalBattles = matches.length;
  const wins = matches.filter((m) => m.result === 'win').length;
  const losses = matches.filter((m) => m.result === 'loss').length;
  const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;
  const totalXpEarned = matches.reduce((sum, m) => sum + (m.xpEarned || 0), 0);

  return { totalBattles, wins, losses, winRate, totalXpEarned };
};

const calculateStreak = (matches) => {
  if (!matches || matches.length === 0) return 0;
  let streak = 0;
  for (let i = 0; i < matches.length; i++) {
    if (matches[i].result === 'win') {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

const Dashboard = () => {
  const navigate = useNavigate();

  // State Declarations
  const [user, setUser] = useState(DEFAULT_DEMO_USER);
  const [matches, setMatches] = useState(DEFAULT_DEMO_MATCHES);
  const [leaderboard, setLeaderboard] = useState(DEFAULT_DEMO_LEADERBOARD);
  const [rankingFilter, setRankingFilter] = useState('GLOBAL');
  const [isLoading, setIsLoading] = useState(false);

  // Load persistent user data safely from LocalStorage
  useEffect(() => {
    setIsLoading(true);
    try {
      // Load stored user profile if existing in Profile.jsx
      const savedUserStr = localStorage.getItem("duoclashUser");
      if (savedUserStr) {
        const parsedUser = JSON.parse(savedUserStr);
        setUser((prev) => ({
          ...prev,
          ...parsedUser,
          name: parsedUser.name || parsedUser.displayName || prev.name,
          avatar: parsedUser.avatar || prev.avatar,
          username: parsedUser.username || prev.username
        }));
      }

      // Load saved matches if available
      const savedMatchesStr = localStorage.getItem("duoclashMatches");
      if (savedMatchesStr) {
        const parsedMatches = JSON.parse(savedMatchesStr);
        if (Array.isArray(parsedMatches) && parsedMatches.length > 0) {
          setMatches(parsedMatches);
        }
      }

      // Load leaderboard if saved
      const savedLdStr = localStorage.getItem("duoclashLeaderboard");
      if (savedLdStr) {
        const parsedLd = JSON.parse(savedLdStr);
        if (Array.isArray(parsedLd) && parsedLd.length > 0) {
          setLeaderboard(parsedLd);
        }
      }
    } catch (err) {
      console.warn("Could not load stored DUOCLASH dashboard data, using fallbacks:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* 
   * Future Django REST API Integration Endpoint Boundary
   * Example:
   * const fetchDashboardDataFromBackend = async () => {
   *    const response = await fetch('/api/dashboard/', { headers: { Authorization: `Bearer ${token}` } });
   *    return await response.json();
   * };
   */

  // Derived Statistics Calculation
  const stats = useMemo(() => calculateStats(matches), [matches]);
  const currentStreak = useMemo(() => calculateStreak(matches), [matches]);

  // Dynamic Rank Movement calculation
  const rankMovement = useMemo(() => {
    if (!user.previousRank || !user.rank) return 0;
    return user.previousRank - user.rank; // Positive means moved up
  }, [user.rank, user.previousRank]);

  // Find Nearby Players dynamically in Leaderboard
  const nearbyPlayers = useMemo(() => {
    if (!leaderboard || leaderboard.length === 0) return [];
    const currentUserIdx = leaderboard.findIndex(
      (p) => p.id === user.id || p.name.toLowerCase() === user.name.toLowerCase()
    );

    if (currentUserIdx === -1) {
      // Return middle slice or first 5 if current user not listed
      return leaderboard.slice(0, 5);
    }

    const start = Math.max(0, currentUserIdx - 2);
    const end = Math.min(leaderboard.length, currentUserIdx + 3);
    return leaderboard.slice(start, end);
  }, [leaderboard, user]);

  // Filtered Leaderboard preview slice
  const filteredLeaderboard = useMemo(() => {
    // In frontend demo mode, adjust order slightly to simulate filters
    let list = [...leaderboard];
    if (rankingFilter === 'WEEKLY') {
      list.sort((a, b) => b.wins - a.wins);
    } else if (rankingFilter === 'MONTHLY') {
      list.sort((a, b) => b.battleRating - a.battleRating);
    } else if (rankingFilter === 'CLAN') {
      list = list.filter((item) => item.rank <= 30);
    }
    return list.slice(0, 7);
  }, [leaderboard, rankingFilter]);

  const handleBattleClick = () => {
    navigate('/battle');
  };

  const handleLeaderboardClick = () => {
    navigate('/leaderboard');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading-viewport">
        <RefreshCw className="spinner-icon" size={32} />
        <p>Loading your battleground command center...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-viewport">
      <div className="dashboard-wrapper">

        {/* ==========================================
            1. HERO / PLAYER COMMAND CENTER
           ========================================== */}
        <section className="dashboard-hero duo-card">
          <div className="hero-profile-container">
            <div className="avatar-wrapper">
              <img src={user.avatar} alt={user.name} className="player-avatar" />
              <span className="level-badge">LVL {user.level}</span>
            </div>

            <div className="hero-text-info">
              <div className="welcome-tag">
                <Sparkles size={14} className="gold-icon" />
                <span>WAR ROOM COMMAND</span>
              </div>
              <h1 className="hero-title">WELCOME BACK, <span className="highlight-gold">{user.name.toUpperCase()}</span></h1>
              <p className="hero-subtitle">Ready for your next competitive coding duel?</p>
              
              {/* XP Progress Bar */}
              <div className="xp-progress-block">
                <div className="xp-labels">
                  <span>EXP: {user.xp} / {user.nextLevelXp} XP</span>
                  <span>{Math.round((user.xp / user.nextLevelXp) * 100)}%</span>
                </div>
                <div className="xp-bar-track">
                  <div 
                    className="xp-bar-fill" 
                    style={{ width: `${Math.min(100, Math.round((user.xp / user.nextLevelXp) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="hero-quick-stats">
            <div className="quick-stat-box">
              <span className="stat-label">GLOBAL RANK</span>
              <div className="stat-value gold-text">#{user.rank}</div>
              {rankMovement !== 0 && (
                <div className={`rank-tag ${rankMovement > 0 ? 'up' : 'down'}`}>
                  {rankMovement > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{Math.abs(rankMovement)} positions</span>
                </div>
              )}
            </div>

            <div className="quick-stat-divider" />

            <div className="quick-stat-box">
              <span className="stat-label">BATTLE RATING</span>
              <div className="stat-value">{user.battleRating}</div>
              <span className="sub-tag">ELO Rating</span>
            </div>

            <div className="quick-stat-divider" />

            <div className="quick-stat-box">
              <span className="stat-label">WIN STREAK</span>
              <div className="stat-value orange-text">🔥 {currentStreak}</div>
              <span className="sub-tag">Active Wins</span>
            </div>
          </div>
        </section>

        {/* ==========================================
            2. PRIMARY BATTLE CTA
           ========================================== */}
        <section className="battle-cta-banner duo-card">
          <div className="cta-content">
            <div className="cta-header">
              <Swords className="cta-icon" size={28} />
              <div>
                <h2>ENTER THE ARENA</h2>
                <p>Challenge peer developers in real-time DSA problem battles</p>
              </div>
            </div>

            <div className="cta-action-buttons">
              <button onClick={handleBattleClick} className="btn-duo-primary">
                <Swords size={18} />
                <span>CREATE BATTLE</span>
              </button>
              <button onClick={handleBattleClick} className="btn-duo-secondary">
                <Shield size={18} />
                <span>JOIN BATTLE</span>
              </button>
              <button onClick={handleBattleClick} className="btn-duo-ghost">
                <Zap size={18} />
                <span>QUICK MATCH</span>
              </button>
            </div>
          </div>
        </section>

        {/* ==========================================
            3. PLAYER STATISTICS GRID
           ========================================== */}
        <section className="dashboard-stats-grid">
          <div className="stat-card duo-card">
            <div className="stat-icon-wrap gold">
              <Swords size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-title">TOTAL BATTLES</span>
              <h3 className="stat-num">{stats.totalBattles}</h3>
              <span className="stat-meta">Completed Duels</span>
            </div>
          </div>

          <div className="stat-card duo-card">
            <div className="stat-icon-wrap green">
              <Trophy size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-title">VICTORIES</span>
              <h3 className="stat-num green-text">{stats.wins}</h3>
              <span className="stat-meta">Matches Won</span>
            </div>
          </div>

          <div className="stat-card duo-card">
            <div className="stat-icon-wrap red">
              <XCircle size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-title">DEFEATS</span>
              <h3 className="stat-num red-text">{stats.losses}</h3>
              <span className="stat-meta">Matches Lost</span>
            </div>
          </div>

          <div className="stat-card duo-card">
            <div className="stat-icon-wrap orange">
              <Activity size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-title">WIN RATE</span>
              <h3 className="stat-num">{stats.winRate}%</h3>
              <span className="stat-meta">Success Percentage</span>
            </div>
          </div>

          <div className="stat-card duo-card">
            <div className="stat-icon-wrap gold">
              <Zap size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-title">TOTAL XP</span>
              <h3 className="stat-num gold-text">{user.xp.toLocaleString()}</h3>
              <span className="stat-meta">Earned Points</span>
            </div>
          </div>

          <div className="stat-card duo-card">
            <div className="stat-icon-wrap orange">
              <BarChart2 size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-title">BATTLE RATING</span>
              <h3 className="stat-num">{user.battleRating}</h3>
              <span className="stat-meta">Competitive Score</span>
            </div>
          </div>
        </section>

        {/* ==========================================
            MAIN TWO-COLUMN LAYOUT
           ========================================== */}
        <div className="dashboard-grid-layout">
          
          {/* LEFT COLUMN */}
          <div className="dashboard-col main-col">

            {/* 4. STREAK & LIVE RANKINGS PANEL */}
            <div className="grid-sub-duo">
              
              {/* CURRENT STREAK PANEL */}
              <div className="streak-panel duo-card">
                <div className="card-header">
                  <Flame className="orange-icon" size={20} />
                  <h3>CURRENT WIN STREAK</h3>
                </div>
                <div className="streak-body">
                  <div className="streak-count-box">
                    <span className="streak-fire">🔥</span>
                    <span className="streak-value">{currentStreak}</span>
                    <span className="streak-label">{currentStreak === 1 ? 'WIN' : 'WINS'}</span>
                  </div>
                  <p className="streak-desc">
                    {currentStreak > 0 
                      ? "Keep your streak alive in the next duel!" 
                      : "Start your winning streak today."}
                  </p>
                  <div className="streak-pills">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span 
                        key={i} 
                        className={`streak-pill ${i < currentStreak ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* LIVE RANKINGS STANDING */}
              <div className="live-rank-panel duo-card">
                <div className="card-header">
                  <div className="live-status-indicator">
                    <span className="pulse-dot" />
                    <span>LIVE RANKING</span>
                  </div>
                  <span className="update-time">Updated moments ago</span>
                </div>
                <div className="live-rank-body">
                  <div className="live-rank-big">
                    <span className="rank-hash">#</span>
                    <span className="rank-digit">{user.rank}</span>
                  </div>
                  <div className="rank-status-details">
                    <span className="movement-text positive">
                      ↑ {rankMovement > 0 ? rankMovement : 3} positions this week
                    </span>
                    <span className="standing-note">
                      Top {Math.max(1, Math.round((user.rank / 500) * 100))}% of active duelists
                    </span>
                  </div>
                </div>
                {/* Comment note for architecture requirement */}
                {/* Frontend demo. Replace with WebSocket/live API updates later. */}
              </div>

            </div>

            {/* 10. RECENT DUELS */}
            <section className="recent-duels-section duo-card">
              <div className="card-header space-between">
                <div className="title-with-icon">
                  <Clock size={20} className="gold-icon" />
                  <h3>RECENT DUELS</h3>
                </div>
                <span className="card-subtitle-badge">{matches.length} Matches Logged</span>
              </div>

              <div className="duels-list">
                {matches.length === 0 ? (
                  <div className="empty-state-box">
                    <Swords size={32} />
                    <p>No battles yet. Enter your first duel!</p>
                  </div>
                ) : (
                  matches.slice(0, 4).map((match) => (
                    <div key={match.id} className={`duel-row ${match.result}`}>
                      <div className="duel-result-tag">
                        {match.result === 'win' ? (
                          <>
                            <CheckCircle2 size={16} className="green-text" />
                            <span className="green-text">VICTORY</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={16} className="red-text" />
                            <span className="red-text">DEFEAT</span>
                          </>
                        )}
                      </div>

                      <div className="duel-opponent">
                        <img src={match.opponentAvatar} alt={match.opponentName} className="mini-avatar" />
                        <div>
                          <span className="opponent-label">vs {match.opponentName}</span>
                          <span className="match-id">{match.id}</span>
                        </div>
                      </div>

                      <div className="duel-problem">
                        <span className="problem-title">{match.problem}</span>
                        <span className={`diff-tag ${match.difficulty.toLowerCase()}`}>{match.difficulty}</span>
                      </div>

                      <div className="duel-stats-meta">
                        <span className="score-val">{match.playerScore} - {match.opponentScore}</span>
                        <span className="time-val">{match.duration}</span>
                      </div>

                      <div className="duel-xp">
                        <span className="xp-badge">+{match.xpEarned} XP</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* 7 & 8. GLOBAL RANKINGS & FILTERS */}
            <section className="universal-leaderboard-section duo-card">
              <div className="card-header space-between leaderboard-header">
                <div className="title-with-icon">
                  <Trophy size={20} className="gold-icon" />
                  <h3>{rankingFilter} RANKINGS</h3>
                </div>

                {/* RANKING FILTERS */}
                <div className="ranking-filter-pills" role="tablist">
                  {['GLOBAL', 'WEEKLY', 'MONTHLY', 'CLAN'].map((filter) => (
                    <button
                      key={filter}
                      className={`filter-btn ${rankingFilter === filter ? 'active' : ''}`}
                      onClick={() => setRankingFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leaderboard Table / Card List */}
              <div className="leaderboard-table-wrapper">
                <table className="duo-table">
                  <thead>
                    <tr>
                      <th>RANK</th>
                      <th>PLAYER</th>
                      <th>LEVEL</th>
                      <th>WINS</th>
                      <th>WIN RATE</th>
                      <th>RATING</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaderboard.map((player) => {
                      const isCurrentPlayer = 
                        player.id === user.id || 
                        player.name.toLowerCase() === user.name.toLowerCase();

                      return (
                        <tr key={player.id} className={isCurrentPlayer ? 'highlight-user-row' : ''}>
                          <td className="rank-cell">
                            {player.rank === 1 && <Medal size={16} className="gold-icon inline-icon" />}
                            #{player.rank}
                          </td>
                          <td className="player-cell">
                            <img src={player.avatar} alt={player.name} className="mini-avatar" />
                            <div className="player-names">
                              <span className="player-fullname">
                                {player.name} {isCurrentPlayer && <span className="you-badge">(YOU)</span>}
                              </span>
                              <span className="player-uname">@{player.username}</span>
                            </div>
                          </td>
                          <td>LVL {player.level}</td>
                          <td>{player.wins} W</td>
                          <td>{player.winRate}%</td>
                          <td className="rating-cell">{player.battleRating}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="card-footer-action">
                <button onClick={handleLeaderboardClick} className="btn-duo-ghost full-width">
                  <span>VIEW FULL LEADERBOARD</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </section>

            {/* 11. DETAILED BATTLE HISTORY */}
            <section className="battle-history-section duo-card">
              <div className="card-header space-between">
                <div className="title-with-icon">
                  <BarChart2 size={20} className="gold-icon" />
                  <h3>BATTLE HISTORY</h3>
                </div>
                <button onClick={handleBattleClick} className="link-action-btn">
                  <span>VIEW ALL</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="history-cards-container">
                {matches.slice(0, 3).map((match) => (
                  <div key={match.id} className="history-card">
                    <div className="history-head">
                      <span className="match-id-badge">{match.id}</span>
                      <span className="match-date">{match.date}</span>
                    </div>

                    <div className="history-body">
                      <div className="opponent-block">
                        <span className="vs-tag">VS</span>
                        <span className="opp-name">{match.opponentName}</span>
                      </div>
                      <div className="problem-block">
                        <span className="prob-name">{match.problem}</span>
                      </div>
                      <div className="match-outcome-block">
                        <span className={`outcome-text ${match.result}`}>
                          {match.result.toUpperCase()}
                        </span>
                        <span className="match-time">{match.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN */}
          <div className="dashboard-col side-col">

            {/* 6. NEARBY PLAYERS / RANKED NEIGHBORS */}
            <section className="ranked-neighbors-section duo-card">
              <div className="card-header">
                <Users size={18} className="gold-icon" />
                <h3>RANKED NEIGHBORS</h3>
              </div>
              <p className="card-sub-info">Rivals close to your global standing</p>

              <div className="neighbors-list">
                {nearbyPlayers.map((player) => {
                  const isUser = 
                    player.id === user.id || 
                    player.name.toLowerCase() === user.name.toLowerCase();

                  return (
                    <div key={player.id} className={`neighbor-row ${isUser ? 'current-player' : ''}`}>
                      <span className="neighbor-rank">#{player.rank}</span>
                      <img src={player.avatar} alt={player.name} className="mini-avatar" />
                      <div className="neighbor-info">
                        <span className="neighbor-name">
                          {player.name} {isUser && <span className="you-pill">YOU</span>}
                        </span>
                        <span className="neighbor-xp">{player.xp} XP</span>
                      </div>
                      <span className="neighbor-rating">{player.battleRating}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 12. ACHIEVEMENTS & PROGRESS */}
            <section className="achievements-section duo-card">
              <div className="card-header space-between">
                <div className="title-with-icon">
                  <Award size={18} className="gold-icon" />
                  <h3>ACHIEVEMENTS</h3>
                </div>
                <span className="achievement-count">4/6 Unlocked</span>
              </div>

              <div className="achievements-list">
                {DEMO_ACHIEVEMENTS.slice(0, 4).map((ach) => {
                  const IconComp = ach.icon;
                  return (
                    <div key={ach.id} className={`achievement-item ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                      <div className="ach-icon-box">
                        <IconComp size={18} />
                      </div>
                      <div className="ach-details">
                        <div className="ach-top">
                          <span className="ach-name">{ach.name}</span>
                          <span className="ach-pct">{ach.progress}%</span>
                        </div>
                        <p className="ach-desc">{ach.description}</p>
                        <div className="ach-progress-bar">
                          <div className="ach-progress-fill" style={{ width: `${ach.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 13. CLAN PREVIEW */}
            <section className="clan-card duo-card">
              <div className="card-header space-between">
                <div className="title-with-icon">
                  <Shield size={18} className="gold-icon" />
                  <h3>YOUR CLAN</h3>
                </div>
                <span className="clan-rank-badge">RANK #{user.clanRank}</span>
              </div>

              {user.clanName ? (
                <div className="clan-body">
                  <div className="clan-main-info">
                    <h4 className="clan-title">{user.clanName}</h4>
                    <span className="clan-members">{user.clanMembers} Warriors Enrolled</span>
                  </div>

                  <div className="clan-stats-grid">
                    <div className="c-stat">
                      <span className="c-label">CLAN XP</span>
                      <span className="c-val">{user.clanXp.toLocaleString()}</span>
                    </div>
                    <div className="c-stat">
                      <span className="c-label">YOUR CONTRIB</span>
                      <span className="c-val gold-text">{user.clanContribution}</span>
                    </div>
                  </div>

                  <button onClick={handleBattleClick} className="btn-duo-secondary full-width">
                    <span>ENTER CLAN WAR ROOM</span>
                  </button>
                </div>
              ) : (
                <div className="empty-clan-state">
                  <p>You're not part of a coding clan yet.</p>
                  <div className="clan-actions">
                    <button onClick={handleBattleClick} className="btn-duo-primary">CREATE CLAN</button>
                    <button onClick={handleBattleClick} className="btn-duo-secondary">JOIN CLAN</button>
                  </div>
                </div>
              )}
            </section>

            {/* 14. PLAYER PROFILE QUICK ACCESS */}
            <section className="profile-quick-card duo-card">
              <div className="card-header">
                <User size={18} className="gold-icon" />
                <h3>YOUR PROFILE</h3>
              </div>

              <div className="profile-quick-body">
                <div className="profile-quick-user">
                  <img src={user.avatar} alt={user.name} className="profile-quick-avatar" />
                  <div>
                    <h4 className="p-name">{user.name}</h4>
                    <span className="p-uname">@{user.username}</span>
                  </div>
                </div>

                <div className="profile-quick-badges">
                  <span className="p-badge">LVL {user.level}</span>
                  <span className="p-badge gold">RANK #{user.rank}</span>
                </div>

                <button onClick={handleProfileClick} className="btn-duo-ghost full-width">
                  <span>VIEW FULL PROFILE</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </section>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;