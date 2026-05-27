import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function StatsPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get("/");
        setTasks(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch task metrics. The backend server might be offline.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating progress..." />;
  }

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG parameters for the circular gauge
  const radius = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  // Motivational message
  let motivation = "Add some tasks to begin tracking your progress!";
  if (total > 0) {
    if (completionRate === 100) {
      motivation = "🎉 Phenomenal job! You have cleared every single task on your dashboard!";
    } else if (completionRate >= 75) {
      motivation = "🚀 Outstanding! You are in the home stretch, keep pushing!";
    } else if (completionRate >= 40) {
      motivation = "⚡ Solid momentum! You are making great progress through your workload.";
    } else if (completionRate > 0) {
      motivation = "🌱 Good start! Take it one step at a time, you've got this.";
    } else {
      motivation = "💤 Ready to start? Toggle task completion status to watch your metrics soar.";
    }
  }

  return (
    <div className="animate-fade-in" id="stats-view" style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Title */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="gradient-text" style={{ fontSize: "2.25rem", textAlign: "left", boxShadow: "none", background: "none", padding: 0, marginBottom: "0.25rem" }}>
          Task Analytics
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Visualize your productivity metrics and achievements.
        </p>
      </div>

      {error && (
        <div className="error-banner" id="stats-error-banner">
          <span>{error}</span>
        </div>
      )}

      <div className="stats-grid">
        {/* Circle Gauge Card */}
        <div className="glass-card completion-gauge-container" id="completion-gauge-card">
          <h3 style={{ marginBottom: "1.5rem" }}>Overall Progress</h3>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg className="progress-circle-svg">
              <circle
                className="progress-circle-bg"
                cx="80"
                cy="80"
                r={radius}
              />
              <circle
                className="progress-circle-bar"
                cx="80"
                cy="80"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="progress-circle-text">
              <span className="progress-circle-percent">{completionRate}%</span>
              <span className="progress-circle-label">Done</span>
            </div>
          </div>

          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.95rem", color: "var(--text-muted)" }}>
            {completed} of {total} milestones completed
          </p>
        </div>

        {/* Breakdown Card */}
        <div className="glass-card" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }} id="stats-breakdown-card">
          <div>
            <h3 style={{ marginBottom: "1.5rem" }}>Status Breakdown</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)", fontWeight: 550 }}>Total Milestones</span>
                <span style={{ fontSize: "1.25rem", fontWeight: 700 }} id="stats-total-val">{total}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--color-success)", fontWeight: 550 }}>Completed Tasks</span>
                <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-success)" }} id="stats-completed-val">{completed}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--color-warning)", fontWeight: 550 }}>Pending Tasks</span>
                <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-warning)" }} id="stats-pending-val">{pending}</span>
              </div>
            </div>
          </div>

          {/* Simple Linear Progress Bar */}
          <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              <span>Completion Rate</span>
              <span>{completionRate}%</span>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-fill" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* Motivational Card */}
        <div className="glass-card stats-card-full" style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }} id="stats-motivation-card">
          <div style={{ fontSize: "2.5rem" }}>💡</div>
          <div>
            <h4 style={{ marginBottom: "0.25rem" }}>Productivity Insights</h4>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }} id="motivation-text">
              {motivation}
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link to="/" className="btn btn-primary" id="stats-go-dashboard-btn">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
