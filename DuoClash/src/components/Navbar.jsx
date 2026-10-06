import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="duoclash-navbar">

      {/* LEFT - LOGO */}
      <Link
        to="/"
        className="duoclash-logo"
        onClick={closeMenu}
      >
        <img
          src="/images/duoclash-logo.png"
          alt="DuoClash Logo"
        />

        <div className="logo-text">
          <span className="logo-name">DUOCLASH</span>
          <span className="logo-tagline">TWO MINDS. ONE BATTLE.</span>
        </div>
      </Link>


      {/* DESKTOP NAVIGATION */}
      <div className="navbar-links">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/battle"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Battle
        </NavLink>

        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Leaderboard
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-link profile-link active" : "nav-link profile-link"
          }
        >
          Profile
        </NavLink>

      </div>


      {/* MOBILE MENU BUTTON */}
      <button
        className={`menu-button ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>


      {/* MOBILE NAVIGATION */}
      <div
        className={`mobile-menu ${
          menuOpen ? "mobile-menu-open" : ""
        }`}
      >

        <NavLink
          to="/"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/battle"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
        >
          Battle
        </NavLink>

        <NavLink
          to="/leaderboard"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
        >
          Leaderboard
        </NavLink>

        <NavLink
          to="/profile"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
        >
          Profile
        </NavLink>

      </div>

    </nav>
  );
}

export default Navbar;