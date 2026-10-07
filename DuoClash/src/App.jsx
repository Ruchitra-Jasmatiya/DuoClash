import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Battle from "./components/Battle.jsx";
import Leaderboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile.jsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;