import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        <NavLink to="/" className="brand" id="brand-logo">
          <div className="brand-icon">✓</div>
          <span>Task<span className="gradient-text">Flow</span></span>
        </NavLink>

        <nav className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            end
            id="nav-home"
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/new" 
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            id="nav-new-task"
          >
            + New Task
          </NavLink>
          <NavLink 
            to="/stats" 
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            id="nav-stats"
          >
            Analytics
          </NavLink>

          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title="Toggle light/dark theme"
            id="theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              // Sun icon
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              // Moon icon
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
