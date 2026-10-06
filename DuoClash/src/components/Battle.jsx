import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Swords,
  Clock,
  Copy,
  Check,
  Play,
  Send,
  Trophy,
  Home,
  RotateCcw,
  X,
  LoaderCircle,
  Terminal,
  Target,
  Zap,
  Crown,
  Gift,
  Flag,
  Users,
  Code,
  ChevronDown,
} from "lucide-react";
import "./Battle.css";

// ============================================================
// TEMPORARY FRONTEND DEMO
// All evaluation, rival simulation, and multiplayer logic is
// simulated on the client. Replace with Django + Channels +
// Docker sandbox later.
// ============================================================

const INITIAL_TIME = 10 * 60; // 10 minutes in seconds
const BATTLE_ID = "DC-48291";

const STARTER_CODE = `class Solution:
    def missingNumber(self, nums):
        # Write your solution here
        pass
`;

const PROBLEM = {
  title: "Find the Missing Number",
  difficulty: "EASY",
  topic: "ARRAYS",
  description: `Given an array containing n distinct numbers taken from 0 to n, return the only number that is missing from the array.

You must solve it in linear time and constant extra space if possible.`,
  examples: [
    {
      input: "[3, 0, 1]",
      output: "2",
      explanation: "n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number in the range since it does not appear in nums.",
    },
    {
      input: "[0, 1]",
      output: "2",
      explanation: "n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 2 is the missing number in the range since it does not appear in nums.",
    },
  ],
  constraints: [
    "1 <= nums.length <= 10^4",
    "0 <= nums[i] <= 10^4",
    "All the numbers of nums are unique.",
  ],
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function Battle() {
  const navigate = useNavigate();

  // ---- Core battle state ----
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [battleEnded, setBattleEnded] = useState(false);
  const [winner, setWinner] = useState(null); // "user" | "rival" | "draw" | null
  const [battleStatus, setBattleStatus] = useState("LIVE"); // LIVE | ENDED

  // ---- Player state ----
  const [userScore, setUserScore] = useState(0);
  const [userAttempts, setUserAttempts] = useState(0);
  const [userTestsPassed, setUserTestsPassed] = useState(0);
  const [userStatus, setUserStatus] = useState("Coding..."); // Coding... | Running tests... | Submitted | Accepted | Wrong Answer
  const [userAccepted, setUserAccepted] = useState(false);

  // ---- Rival state (simulated) ----
  const [rivalScore, setRivalScore] = useState(0);
  const [rivalAttempts, setRivalAttempts] = useState(0);
  const [rivalTestsPassed, setRivalTestsPassed] = useState(0);
  const [rivalStatus, setRivalStatus] = useState("Coding...");
  const [rivalAccepted, setRivalAccepted] = useState(false);

  // ---- Editor & judge ----
  const [code, setCode] = useState(STARTER_CODE);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null); // null | { passed, total, cases: [...] }
  const [showXpPopup, setShowXpPopup] = useState(false);

  // ---- UI state ----
  const [activeTab, setActiveTab] = useState("problem"); // problem | examples | constraints
  const [copied, setCopied] = useState(false);
  const [activityLog, setActivityLog] = useState([
    { time: "00:00", text: "You joined the battleground" },
  ]);
  const [showReward, setShowReward] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const timerRef = useRef(null);
  const rivalTimeoutRef = useRef(null);
  const elapsedRef = useRef(0);

  // ---- Timer ----
  useEffect(() => {
    if (battleEnded) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        elapsedRef.current += 1;
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [battleEnded]);

  // ---- Rival simulation (demo only) ----
  useEffect(() => {
    // TEMPORARY FRONTEND DEMO – replace with WebSocket events
    const t1 = setTimeout(() => {
      addLog("Rival started coding");
      setRivalStatus("Coding...");
    }, 8000);

    const t2 = setTimeout(() => {
      if (!battleEnded && !userAccepted) {
        setRivalStatus("Running tests...");
        addLog("Rival ran their code");
      }
    }, 45000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (rivalTimeoutRef.current) clearTimeout(rivalTimeoutRef.current);
    };
  }, []);

  function addLog(text) {
    const elapsed = INITIAL_TIME - timeLeft;
    const stamp = formatTime(elapsed);
    setActivityLog((prev) => [...prev, { time: stamp, text }]);
  }

  function handleTimeUp() {
    setBattleEnded(true);
    setBattleStatus("ENDED");
    if (userAccepted && rivalAccepted) {
      // whoever accepted first wins – for demo assume user if they have higher score
      setWinner(userScore >= rivalScore ? "user" : "rival");
    } else if (userAccepted) {
      setWinner("user");
    } else if (rivalAccepted) {
      setWinner("rival");
    } else {
      setWinner("draw");
    }
    addLog("Time is up! Battle ended.");
  }

  // ---- Copy Battle ID ----
  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(BATTLE_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // graceful fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  // ---- Simulated judge (frontend demo only) ----
  // TEMPORARY FRONTEND DEMO
  // Replace this entire function with a secure backend Docker sandbox call.
  function simulateJudge(isSubmit = false) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trimmed = code.trim();
        const isEmpty =
          !trimmed ||
          trimmed.includes("pass") ||
          trimmed === STARTER_CODE.trim();

        if (isEmpty) {
          resolve({
            success: false,
            passed: 2,
            total: 5,
            cases: [
              { id: 1, status: "pass", expected: "2", received: "2" },
              { id: 2, status: "pass", expected: "2", received: "2" },
              { id: 3, status: "fail", expected: "2", received: "1" },
              { id: 4, status: "fail", expected: "8", received: "0" },
              { id: 5, status: "fail", expected: "1", received: "None" },
            ],
          });
        } else {
          // Assume any non-starter code is a correct solution for the demo
          resolve({
            success: true,
            passed: 5,
            total: 5,
            cases: [
              { id: 1, status: "pass", expected: "2", received: "2" },
              { id: 2, status: "pass", expected: "2", received: "2" },
              { id: 3, status: "pass", expected: "8", received: "8" },
              { id: 4, status: "pass", expected: "1", received: "1" },
              { id: 5, status: "pass", expected: "0", received: "0" },
            ],
          });
        }
      }, isSubmit ? 1600 : 1200);
    });
  }

  async function handleRunCode() {
    if (isRunning || isSubmitting || battleEnded) return;
    setIsRunning(true);
    setUserStatus("Running tests...");
    setTestResults(null);
    addLog("You ran your code");

    const result = await simulateJudge(false);
    setTestResults(result);
    setUserTestsPassed(result.passed);
    setIsRunning(false);
    setUserStatus(result.success ? "Coding..." : "Coding...");
  }

  async function handleSubmit() {
    if (isRunning || isSubmitting || battleEnded || userAccepted) return;

    setIsSubmitting(true);
    setUserStatus("Submitted");
    setUserAttempts((a) => a + 1);
    setTestResults(null);
    addLog("You submitted a solution");

    const result = await simulateJudge(true);
    setTestResults(result);
    setUserTestsPassed(result.passed);
    setIsSubmitting(false);

    if (result.success) {
      setUserAccepted(true);
      setUserStatus("Accepted");
      setUserScore((s) => s + 100);
      setShowXpPopup(true);
      setTimeout(() => setShowXpPopup(false), 2200);
      addLog("Solution ACCEPTED! +100 XP");

      // Stop timer early if accepted
      if (timerRef.current) clearInterval(timerRef.current);

      // Simulate rival reaction
      setRivalStatus("Coding...");
      addLog("You solved it! Waiting for rival...");

      // TEMPORARY FRONTEND DEMO – rival eventually accepts or fails
      rivalTimeoutRef.current = setTimeout(() => {
        const rivalWins = Math.random() > 0.65; // small chance rival was faster
        if (rivalWins) {
          setRivalAccepted(true);
          setRivalStatus("Accepted");
          setRivalScore(100);
          setRivalAttempts((a) => a + 1);
          setRivalTestsPassed(5);
          addLog("Rival also got Accepted");
          setWinner("rival");
          setBattleEnded(true);
          setBattleStatus("ENDED");
        } else {
          setRivalStatus("Wrong Answer");
          setRivalAttempts((a) => a + 1);
          addLog("Rival failed hidden tests");
          setTimeout(() => {
            setWinner("user");
            setBattleEnded(true);
            setBattleStatus("ENDED");
            setShowReward(true);
            addLog("Victory! You defeated your rival.");
          }, 1800);
        }
      }, 4500);
    } else {
      setUserStatus("Wrong Answer");
      addLog("Wrong Answer – some hidden tests failed");
      // allow retry – do NOT end battle
    }
  }

  function handleRematch() {
    // Reset everything for a fresh duel
    if (timerRef.current) clearInterval(timerRef.current);
    if (rivalTimeoutRef.current) clearTimeout(rivalTimeoutRef.current);

    setTimeLeft(INITIAL_TIME);
    setBattleEnded(false);
    setWinner(null);
    setBattleStatus("LIVE");
    setUserScore(0);
    setUserAttempts(0);
    setUserTestsPassed(0);
    setUserStatus("Coding...");
    setUserAccepted(false);
    setRivalScore(0);
    setRivalAttempts(0);
    setRivalTestsPassed(0);
    setRivalStatus("Coding...");
    setRivalAccepted(false);
    setCode(STARTER_CODE);
    setIsRunning(false);
    setIsSubmitting(false);
    setTestResults(null);
    setShowXpPopup(false);
    setActiveTab("problem");
    setCopied(false);
    setActivityLog([{ time: "00:00", text: "Rematch started – new battleground" }]);
    setShowReward(false);
    elapsedRef.current = 0;
  }

  function handleReturnHome() {
    navigate("/");
  }

  const isFinalMinute = timeLeft <= 60 && timeLeft > 0;
  const timerDisplay = formatTime(timeLeft);

  return (
    <div className="battle-page">
      {/* ========== BATTLE HEADER ========== */}
      <header className="battle-header">
        <div className="header-left">
          <div className="arena-label">
            <Swords size={16} />
            <span>DUOCLASH BATTLEGROUND</span>
          </div>
          <h1 className="arena-title">CODING DUEL</h1>
        </div>

        <div className={`header-timer ${isFinalMinute ? "urgent" : ""}`}>
          <Clock size={22} className="timer-icon" />
          <span className="timer-value">{timerDisplay}</span>
          {isFinalMinute && <span className="final-minute">FINAL MINUTE</span>}
        </div>

        <div className="header-right">
          <div className="status-live">
            <span className={`live-dot ${battleStatus === "LIVE" ? "pulse" : ""}`} />
            <span>{battleStatus}</span>
          </div>
          <div className="battle-id-row">
            <span className="battle-id-label">Battle ID:</span>
            <span className="battle-id-value">#{BATTLE_ID}</span>
            <button
              className="copy-btn"
              onClick={handleCopyId}
              aria-label="Copy Battle ID"
              title="Copy Battle ID"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            {copied && <span className="copied-toast">Copied!</span>}
          </div>
        </div>
      </header>

      {/* ========== YOU VS RIVAL ========== */}
      <section className="vs-section">
        <div className="player-card you-card">
          <div className="player-badge">YOU</div>
          <div className="avatar you-avatar">R</div>
          <div className="player-info">
            <h3 className="player-name">Ruchitra</h3>
            <div className="player-status online">
              <span className="status-dot" /> Online
            </div>
            <div className="coding-status">
              {userStatus === "Coding..." ? (
                <span className="coding-dots">Coding<span>.</span><span>.</span><span>.</span></span>
              ) : (
                userStatus
              )}
            </div>
          </div>
          <div className="player-stats">
            <div className="stat">
              <span className="stat-label">Score</span>
              <span className="stat-value gold">{userScore}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Attempts</span>
              <span className="stat-value">{userAttempts}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Tests</span>
              <span className="stat-value">{userTestsPassed}/5</span>
            </div>
          </div>
          {showXpPopup && <div className="xp-popup">+100 XP</div>}
        </div>

        <div className="vs-divider">
          <div className="vs-icon-wrap">
            <Swords size={28} />
          </div>
          <span className="vs-text">VS</span>
        </div>

        <div className="player-card rival-card">
          <div className="player-badge rival-badge">RIVAL</div>
          <div className="avatar rival-avatar">S</div>
          <div className="player-info">
            <h3 className="player-name">Sakshi</h3>
            <div className="player-status online">
              <span className="status-dot" /> Online
            </div>
            <div className="coding-status">
              {rivalStatus === "Coding..." ? (
                <span className="coding-dots">Coding<span>.</span><span>.</span><span>.</span></span>
              ) : (
                rivalStatus
              )}
            </div>
          </div>
          <div className="player-stats">
            <div className="stat">
              <span className="stat-label">Score</span>
              <span className="stat-value green">{rivalScore}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Attempts</span>
              <span className="stat-value">{rivalAttempts}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Tests</span>
              <span className="stat-value">{rivalTestsPassed}/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MAIN WORKSPACE ========== */}
      {!battleEnded && (
        <section className="workspace">
          {/* LEFT – Question Panel */}
          <aside className="question-panel">
            <div className="question-header">
              <div className="badges">
                <span className="badge difficulty">{PROBLEM.difficulty}</span>
                <span className="badge topic">{PROBLEM.topic}</span>
              </div>
              <h2 className="question-title">{PROBLEM.title}</h2>
            </div>

            <div className="question-tabs" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === "problem"}
                className={`q-tab ${activeTab === "problem" ? "active" : ""}`}
                onClick={() => setActiveTab("problem")}
              >
                Problem
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "examples"}
                className={`q-tab ${activeTab === "examples" ? "active" : ""}`}
                onClick={() => setActiveTab("examples")}
              >
                Examples
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "constraints"}
                className={`q-tab ${activeTab === "constraints" ? "active" : ""}`}
                onClick={() => setActiveTab("constraints")}
              >
                Constraints
              </button>
            </div>

            <div className="question-body">
              {activeTab === "problem" && (
                <div className="tab-content fade-in">
                  <p className="problem-desc">{PROBLEM.description}</p>
                </div>
              )}
              {activeTab === "examples" && (
                <div className="tab-content fade-in">
                  {PROBLEM.examples.map((ex, i) => (
                    <div key={i} className="example-block">
                      <div className="example-label">Example {i + 1}</div>
                      <div className="example-row">
                        <span className="ex-key">Input:</span>
                        <code>{ex.input}</code>
                      </div>
                      <div className="example-row">
                        <span className="ex-key">Output:</span>
                        <code>{ex.output}</code>
                      </div>
                      {ex.explanation && (
                        <p className="example-explain">{ex.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "constraints" && (
                <div className="tab-content fade-in">
                  <ul className="constraints-list">
                    {PROBLEM.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT – Code Editor + Results + Log */}
          <div className="editor-column">
            <div className="editor-panel">
              <div className="editor-toolbar">
                <div className="editor-title">
                  <Terminal size={16} />
                  <span>CODE EDITOR</span>
                </div>
                <div className="lang-selector">
                  <button
                    className="lang-btn"
                    onClick={() => setLanguageOpen((o) => !o)}
                    aria-haspopup="listbox"
                    aria-expanded={languageOpen}
                  >
                    Python 3
                    <ChevronDown size={14} />
                  </button>
                  {languageOpen && (
                    <ul className="lang-dropdown" role="listbox">
                      <li role="option" aria-selected className="selected">
                        Python 3
                      </li>
                      <li role="option" className="disabled">
                        Java (soon)
                      </li>
                      <li role="option" className="disabled">
                        C++ (soon)
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              <div className="editor-wrapper">
                <div className="line-numbers" aria-hidden="true">
                  {code.split("\n").map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <textarea
                  className="code-textarea"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  aria-label="Code editor"
                  disabled={battleEnded || userAccepted}
                />
              </div>

              <div className="editor-actions">
                <button
                  className="btn btn-run"
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting || battleEnded || userAccepted}
                >
                  {isRunning ? (
                    <>
                      <LoaderCircle size={16} className="spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      Run Code
                    </>
                  )}
                </button>
                <button
                  className="btn btn-submit"
                  onClick={handleSubmit}
                  disabled={isRunning || isSubmitting || battleEnded || userAccepted}
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle size={16} className="spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Solution
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Test Results */}
            <div className="test-panel">
              <div className="panel-title">
                <Target size={15} />
                <span>TEST RESULTS</span>
              </div>
              {!testResults && !isRunning && !isSubmitting && (
                <p className="test-placeholder">Run your code to see test results.</p>
              )}
              {(isRunning || isSubmitting) && (
                <div className="test-loading">
                  <LoaderCircle size={18} className="spin" />
                  <span>Running tests...</span>
                </div>
              )}
              {testResults && !isRunning && !isSubmitting && (
                <div className="test-results fade-in">
                  <div className={`result-summary ${testResults.success ? "pass" : "fail"}`}>
                    {testResults.success ? (
                      <>
                        <Check size={16} /> {testResults.passed}/{testResults.total} Test Cases Passed
                      </>
                    ) : (
                      <>
                        <X size={16} /> {testResults.passed}/{testResults.total} Test Cases Passed
                      </>
                    )}
                  </div>
                  <ul className="case-list">
                    {testResults.cases.map((c) => (
                      <li key={c.id} className={`case-item ${c.status}`}>
                        {c.status === "pass" ? (
                          <Check size={14} />
                        ) : (
                          <X size={14} />
                        )}
                        <span>
                          Test Case {c.id} {c.status === "pass" ? "Passed" : "Failed"}
                        </span>
                        {c.status === "fail" && (
                          <span className="case-detail">
                            Expected: {c.expected} · Received: {c.received}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Battle Log */}
            <div className="log-panel">
              <div className="panel-title">
                <Flag size={15} />
                <span>BATTLE LOG</span>
              </div>
              <ul className="log-list">
                {activityLog.map((entry, i) => (
                  <li key={i} className="log-entry">
                    <span className="log-time">{entry.time}</span>
                    <span className="log-text">{entry.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ========== BATTLE RESULT ========== */}
      {battleEnded && (
        <section className="result-section fade-in-up">
          <div className={`result-card ${winner}`}>
            {winner === "user" && (
              <>
                <div className="result-icon victory">
                  <Trophy size={48} />
                </div>
                <h2 className="result-title">VICTORY</h2>
                <p className="result-subtitle">You defeated your rival!</p>
                <div className="result-stats">
                  <div className="r-stat">
                    <span className="r-label">XP Earned</span>
                    <span className="r-value gold">+{userScore}</span>
                  </div>
                  <div className="r-stat">
                    <span className="r-label">Attempts</span>
                    <span className="r-value">{userAttempts}</span>
                  </div>
                  <div className="r-stat">
                    <span className="r-label">Time</span>
                    <span className="r-value">{formatTime(INITIAL_TIME - timeLeft)}</span>
                  </div>
                  <div className="r-stat">
                    <span className="r-label">Accuracy</span>
                    <span className="r-value">100%</span>
                  </div>
                </div>
              </>
            )}
            {winner === "rival" && (
              <>
                <div className="result-icon defeat">
                  <X size={48} />
                </div>
                <h2 className="result-title">DEFEAT</h2>
                <p className="result-subtitle">Your rival won this duel.</p>
                <div className="result-stats">
                  <div className="r-stat">
                    <span className="r-label">Your Score</span>
                    <span className="r-value">{userScore}</span>
                  </div>
                  <div className="r-stat">
                    <span className="r-label">Attempts</span>
                    <span className="r-value">{userAttempts}</span>
                  </div>
                  <div className="r-stat">
                    <span className="r-label">Time</span>
                    <span className="r-value">{formatTime(INITIAL_TIME - timeLeft)}</span>
                  </div>
                </div>
              </>
            )}
            {winner === "draw" && (
              <>
                <div className="result-icon draw">
                  <Users size={48} />
                </div>
                <h2 className="result-title">DRAW</h2>
                <p className="result-subtitle">Both duelists fought until the end.</p>
                <div className="result-stats">
                  <div className="r-stat">
                    <span className="r-label">Your Score</span>
                    <span className="r-value">{userScore}</span>
                  </div>
                  <div className="r-stat">
                    <span className="r-label">Attempts</span>
                    <span className="r-value">{userAttempts}</span>
                  </div>
                  <div className="r-stat">
                    <span className="r-label">Time</span>
                    <span className="r-value">10:00</span>
                  </div>
                </div>
              </>
            )}

            <div className="result-actions">
              <button className="btn btn-rematch" onClick={handleRematch}>
                <RotateCcw size={16} />
                Rematch
              </button>
              <button className="btn btn-home" onClick={handleReturnHome}>
                <Home size={16} />
                Return Home
              </button>
            </div>

            {/* Reward UI (frontend only) */}
            {winner === "user" && showReward && (
              <div className="reward-box fade-in">
                <div className="reward-header">
                  <Gift size={18} />
                  <span>REWARD UNLOCKED</span>
                </div>
                <p className="reward-desc">🏆 Battle Reward — Choose a challenge for your rival</p>
                <div className="reward-options">
                  <button className="reward-btn" disabled>
                    Challenge: 1 Easy Problem
                  </button>
                  <button className="reward-btn" disabled>
                    Challenge: 2 Easy Problems
                  </button>
                  <button className="reward-btn" onClick={handleRematch}>
                    Rematch
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default Battle;