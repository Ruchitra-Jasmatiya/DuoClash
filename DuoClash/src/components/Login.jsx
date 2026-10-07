import React, { useState } from 'react';
import { Eye, EyeOff, Swords, CheckCircle2, AlertCircle, User, Mail, Lock, ShieldAlert } from 'lucide-react';

const duoStyles = `
:root {
  --duo-gold: #d4af37;
  --duo-gold-glow: rgba(212, 175, 55, 0.35);
  --duo-gold-light: #f3e5ab;
  --duo-orange: #f97316;
  --duo-orange-hover: #ea580c;
  --duo-orange-glow: rgba(249, 115, 22, 0.4);
  --duo-navy-bg: rgba(10, 20, 30, 0.68);
  --duo-card-border: rgba(212, 175, 55, 0.28);
  --duo-green: #22c55e;
  --duo-red: #ef4444;
  --duo-text-main: #f8fafc;
  --duo-text-muted: #94a3b8;
  --duo-font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Base Viewport Container */
.duo-auth-viewport {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--duo-font-family);
  box-sizing: border-box;
  overflow-x: hidden;
  background-color: #030712;
}

/* Background image layer with battle scene fallback */
.duo-bg-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  z-index: 0;
  background-image: 
    linear-gradient(to bottom, rgba(3, 7, 18, 0.6), rgba(3, 7, 18, 0.85)),
    url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop');
}

.duo-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(3, 7, 18, 0.25) 0%, rgba(3, 7, 18, 0.8) 100%);
  z-index: 1;
}

/* Glassmorphic Auth Card HUD */
.duo-auth-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 440px;
  display: flex;
  justify-content: center;
}

.duo-auth-card {
  position: relative;
  width: 100%;
  background: var(--duo-navy-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--duo-card-border);
  border-radius: 20px;
  padding: 2.25rem 2rem 1.75rem 2rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.08);
  animation: duoCardEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-sizing: border-box;
}

/* HUD Decorative Corner Clips */
.hud-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: var(--duo-gold);
  border-style: solid;
  pointer-events: none;
  opacity: 0.85;
}

.hud-corner.top-left {
  top: -1px;
  left: -1px;
  border-width: 2px 0 0 2px;
  border-top-left-radius: 20px;
}

.hud-corner.top-right {
  top: -1px;
  right: -1px;
  border-width: 2px 2px 0 0;
  border-top-right-radius: 20px;
}

.hud-corner.bottom-left {
  bottom: -1px;
  left: -1px;
  border-width: 0 0 2px 2px;
  border-bottom-left-radius: 20px;
}

.hud-corner.bottom-right {
  bottom: -1px;
  right: -1px;
  border-width: 0 2px 2px 0;
  border-bottom-right-radius: 20px;
}

/* Header Styling */
.duo-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.duo-brand-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

.duo-swords-icon {
  color: var(--duo-gold);
  filter: drop-shadow(0 0 8px var(--duo-gold-glow));
}

.duo-header h1 {
  margin: 0;
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: #ffffff;
  text-transform: uppercase;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.duo-subtitle {
  margin: 0.35rem 0 0 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--duo-gold-light);
  opacity: 0.9;
  text-transform: uppercase;
}

.duo-gold-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--duo-gold), transparent);
  margin: 0.85rem auto 0 auto;
}

/* Tab Navigation Controls */
.duo-tab-nav {
  position: relative;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
}

.duo-tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.75rem 0;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--duo-text-muted);
  cursor: pointer;
  transition: color 0.3s ease;
}

.duo-tab-btn.active {
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.duo-tab-btn:hover:not(.active) {
  color: var(--duo-text-main);
}

.duo-tab-indicator {
  position: absolute;
  bottom: -1px;
  width: 50%;
  height: 2px;
  background: linear-gradient(90deg, var(--duo-gold), var(--duo-orange));
  box-shadow: 0 0 10px var(--duo-orange-glow);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.duo-tab-indicator.slide-left {
  transform: translateX(0%);
}

.duo-tab-indicator.slide-right {
  transform: translateX(100%);
}

/* Inputs & Form Styling */
.duo-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.duo-field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.duo-field-group label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--duo-gold-light);
  text-transform: uppercase;
}

.duo-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--duo-text-muted);
  pointer-events: none;
  transition: color 0.25s ease;
}

.duo-input-wrapper input {
  width: 100%;
  padding: 0.8rem 2.8rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  font-size: 0.9rem;
  color: var(--duo-text-main);
  outline: none;
  box-sizing: border-box;
  transition: all 0.25s ease;
}

.duo-input-wrapper input::placeholder {
  color: #64748b;
}

/* Input Focus States */
.duo-input-wrapper input:focus {
  border-color: var(--duo-gold);
  background: rgba(15, 23, 42, 0.85);
  box-shadow: 0 0 12px var(--duo-gold-glow);
}

.duo-input-wrapper input:focus ~ .input-icon {
  color: var(--duo-gold);
}

/* Valid & Invalid States */
.duo-field-group.is-valid .duo-input-wrapper input {
  border-color: var(--duo-green);
}

.duo-field-group.has-error .duo-input-wrapper input {
  border-color: var(--duo-red);
  animation: duoFieldShake 0.35s ease-in-out;
}

.status-icon {
  position: absolute;
  right: 1rem;
  pointer-events: none;
}

.valid-icon {
  color: var(--duo-green);
}

.error-icon {
  color: var(--duo-red);
}

/* Password Toggle Icon Button */
.duo-toggle-pwd {
  position: absolute;
  right: 0.8rem;
  background: transparent;
  border: none;
  color: var(--duo-text-muted);
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.duo-toggle-pwd:hover {
  color: var(--duo-text-main);
}

/* Inline Validation Error Messages */
.duo-field-error {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #fca5a5;
  font-size: 0.72rem;
  font-weight: 500;
  margin-top: 0.15rem;
  animation: duoFadeInSlide 0.25s ease-out forwards;
}

/* Submit Button & Shine Animation */
.duo-submit-btn {
  position: relative;
  margin-top: 0.5rem;
  padding: 0.9rem;
  background: linear-gradient(135deg, var(--duo-orange) 0%, #c2410c 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 4px 15px var(--duo-orange-glow);
  transition: all 0.25s ease;
}

.duo-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px var(--duo-orange-glow);
  background: linear-gradient(135deg, #fb923c 0%, var(--duo-orange-hover) 100%);
}

.duo-submit-btn:active:not(:disabled) {
  transform: translateY(1px);
  box-shadow: 0 2px 10px var(--duo-orange-glow);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  transform: skewX(-25deg);
}

.duo-submit-btn:hover .btn-shine {
  animation: duoShinePass 0.75s ease-in-out;
}

/* Success Alert Banner */
.duo-success-alert {
  margin-top: 1.15rem;
  padding: 0.85rem;
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid var(--duo-green);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #86efac;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  animation: duoFadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.success-icon {
  color: var(--duo-green);
}

/* Card Footer Badge */
.duo-card-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.hud-badge {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--duo-text-muted);
  opacity: 0.6;
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
  padding-top: 0.8rem;
  display: inline-block;
  width: 100%;
}

/* Keyframe Animations */
@keyframes duoCardEntrance {
  0% { opacity: 0; transform: translateY(20px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes duoFieldShake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

@keyframes duoFadeInSlide {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes duoFadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes duoShinePass {
  100% { left: 200%; }
}

@media (max-width: 480px) {
  .duo-auth-viewport { padding: 1rem; }
  .duo-auth-card { padding: 1.75rem 1.25rem 1.25rem 1.25rem; border-radius: 16px; }
  .duo-header h1 { font-size: 1.5rem; }
  .duo-input-wrapper input { font-size: 0.85rem; padding: 0.75rem 2.5rem; }
}
`;

/**
 * DuoClash Authentication Component
 * High-performance, game HUD styled authentication card featuring
 * real-time validation, responsive layout, glassmorphism UI, and custom feedback animations.
 */
const Login = () => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const NAME_REGEX = /^[a-zA-Z\s]+$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (fieldName, value) => {
    let error = '';

    if (fieldName === 'name' && mode === 'register') {
      if (!value.trim()) {
        error = 'Warrior name is required';
      } else if (!NAME_REGEX.test(value.trim())) {
        error = 'Name must contain letters and spaces only';
      }
    }

    if (fieldName === 'email') {
      if (!value.trim()) {
        error = 'Warrior email is required';
      } else if (!EMAIL_REGEX.test(value.trim())) {
        error = 'Enter a valid battle email address';
      }
    }

    if (fieldName === 'password') {
      if (!value) {
        error = 'Battle password is required';
      } else if (value.length < 8) {
        error = 'Password must be at least 8 characters long';
      } else if (!/[a-zA-Z]/.test(value)) {
        error = 'Password must contain at least one letter';
      } else if (!/[0-9]/.test(value)) {
        error = 'Password must contain at least one number';
      }
    }

    return error;
  };

  const handleModeSwitch = (newMode) => {
    if (mode === newMode) return;
    setMode(newMode);
    setErrors({});
    setTouched({});
    setSuccessMessage('');
    setShowPassword(false);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');

    const fieldsToValidate = mode === 'register' ? ['name', 'email', 'password'] : ['email', 'password'];
    
    const newErrors = {};
    const newTouched = {};

    fieldsToValidate.forEach((field) => {
      newTouched[field] = true;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === 'login') {
        setSuccessMessage('✓ Successfully logged in!');
      } else {
        setSuccessMessage('✓ Successfully registered!');
      }

      setFormData({ name: '', email: '', password: '' });
      setTouched({});
      setErrors({});
    }, 600);
  };

  const getFieldStatus = (fieldName) => {
    if (!touched[fieldName]) return '';
    return errors[fieldName] ? 'has-error' : 'is-valid';
  };

  return (
    <div className="duo-auth-viewport">
      <style>{duoStyles}</style>

      {/* Background Layer with Overlay */}
      <div className="duo-bg-layer" aria-hidden="true" />
      <div className="duo-bg-overlay" aria-hidden="true" />

      {/* Main HUD Card Wrapper */}
      <main className="duo-auth-wrapper">
        <div className="duo-auth-card">
          {/* Corner HUD accents */}
          <span className="hud-corner top-left" aria-hidden="true" />
          <span className="hud-corner top-right" aria-hidden="true" />
          <span className="hud-corner bottom-left" aria-hidden="true" />
          <span className="hud-corner bottom-right" aria-hidden="true" />

          {/* Header Section */}
          <header className="duo-header">
            <div className="duo-brand-title">
              <Swords className="duo-swords-icon" aria-hidden="true" size={28} />
              <h1>DUOCLASH</h1>
            </div>
            <p className="duo-subtitle">
              {mode === 'login' ? 'ENTER THE CLASH' : 'PREPARE FOR BATTLE'}
            </p>
            <div className="duo-gold-divider" aria-hidden="true" />
          </header>

          {/* Mode Navigation Bar */}
          <nav className="duo-tab-nav" aria-label="Authentication Options">
            <button
              type="button"
              className={`duo-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => handleModeSwitch('login')}
              aria-selected={mode === 'login'}
            >
              LOGIN
            </button>
            <button
              type="button"
              className={`duo-tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => handleModeSwitch('register')}
              aria-selected={mode === 'register'}
            >
              REGISTER
            </button>
            <div 
              className={`duo-tab-indicator ${mode === 'register' ? 'slide-right' : 'slide-left'}`}
              aria-hidden="true"
            />
          </nav>

          {/* Authentication Form */}
          <form className="duo-form" onSubmit={handleSubmit} noValidate>
            {/* REGISTER MODE ONLY: Warrior Name Field */}
            {mode === 'register' && (
              <div className={`duo-field-group ${getFieldStatus('name')}`}>
                <label htmlFor="warrior-name">WARRIOR NAME</label>
                <div className="duo-input-wrapper">
                  <User className="input-icon" size={18} aria-hidden="true" />
                  <input
                    id="warrior-name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="name"
                    required
                  />
                  {getFieldStatus('name') === 'is-valid' && (
                    <CheckCircle2 className="status-icon valid-icon" size={18} aria-hidden="true" />
                  )}
                  {getFieldStatus('name') === 'has-error' && (
                    <AlertCircle className="status-icon error-icon" size={18} aria-hidden="true" />
                  )}
                </div>
                {touched.name && errors.name && (
                  <div className="duo-field-error" id="name-error" role="alert">
                    <ShieldAlert size={14} />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>
            )}

            {/* Warrior Email Field */}
            <div className={`duo-field-group ${getFieldStatus('email')}`}>
              <label htmlFor="warrior-email">WARRIOR EMAIL</label>
              <div className="duo-input-wrapper">
                <Mail className="input-icon" size={18} aria-hidden="true" />
                <input
                  id="warrior-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  required
                />
                {getFieldStatus('email') === 'is-valid' && (
                  <CheckCircle2 className="status-icon valid-icon" size={18} aria-hidden="true" />
                )}
                {getFieldStatus('email') === 'has-error' && (
                  <AlertCircle className="status-icon error-icon" size={18} aria-hidden="true" />
                )}
              </div>
              {touched.email && errors.email && (
                <div className="duo-field-error" id="email-error" role="alert">
                  <ShieldAlert size={14} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Battle Password Field */}
            <div className={`duo-field-group ${getFieldStatus('password')}`}>
              <label htmlFor="battle-password">BATTLE PASSWORD</label>
              <div className="duo-input-wrapper">
                <Lock className="input-icon" size={18} aria-hidden="true" />
                <input
                  id="battle-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  className="duo-toggle-pwd"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <div className="duo-field-error" id="password-error" role="alert">
                  <ShieldAlert size={14} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              className={`duo-submit-btn ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              <span className="btn-shine" aria-hidden="true" />
              <span className="btn-text">
                {mode === 'login' ? 'ENTER THE CLASH' : 'JOIN DUOCLASH'}
              </span>
            </button>
          </form>

          {/* Success Banner */}
          {successMessage && (
            <div className="duo-success-alert" role="status" aria-live="polite">
              <CheckCircle2 size={20} className="success-icon" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Subtitle footer badge */}
          <footer className="duo-card-footer">
            <span className="hud-badge">BATTLEGROUND ACCESS</span>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Login;