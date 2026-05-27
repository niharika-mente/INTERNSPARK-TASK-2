import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import TaskCard from "../components/TaskCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "completed" | "pending"
  const [searchQuery, setSearchQuery] = useState("");

  const getTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks. Please ensure your backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleToggleTask = async (task) => {
    const originalTasks = [...tasks];
    
    // Optimistic UI update
    setTasks(
      tasks.map((t) => (t._id === task._id ? { ...t, completed: !t.completed } : t))
    );

    try {
      await API.put(`/${task._id}`, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to update task state. Rolling back changes.");
      // Rollback
      setTasks(originalTasks);
    }
  };

  const handleDeleteTask = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    const originalTasks = [...tasks];
    // Optimistic UI update
    setTasks(tasks.filter((t) => t._id !== id));

    try {
      await API.delete(`/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to delete task. Rolling back changes.");
      // Rollback
      setTasks(originalTasks);
    }
  };

  // Computations
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;

  // Filter & Search tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed);

    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="animate-fade-in" id="task-dashboard">
      {/* Page Title */}
      <div className="dashboard-header">
        <div>
          <h1 className="gradient-text" style={{ fontSize: "2.25rem", textAlign: "left", boxShadow: "none", background: "none", padding: 0, marginBottom: "0.25rem" }}>
            Workspace
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Manage your daily milestones and tracking details.
          </p>
        </div>
        <Link to="/new" className="btn btn-primary" id="add-task-header-btn">
          <span>+ Add New Task</span>
        </Link>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="error-banner" id="error-banner">
          <span>{error}</span>
          <button className="btn-link" onClick={() => setError("")} style={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}>
            ✕
          </button>
        </div>
      )}

      {/* Mini Stats Summary */}
      <div className="stats-summary">
        <div className="glass-card stat-item" id="stat-total">
          <div className="stat-icon-box total">☰</div>
          <div className="stat-info">
            <span className="stat-val">{totalCount}</span>
            <span className="stat-lbl">Total Tasks</span>
          </div>
        </div>
        <div className="glass-card stat-item" id="stat-completed">
          <div className="stat-icon-box completed">✓</div>
          <div className="stat-info">
            <span className="stat-val">{completedCount}</span>
            <span className="stat-lbl">Completed</span>
          </div>
        </div>
        <div className="glass-card stat-item" id="stat-pending">
          <div className="stat-icon-box pending">⌛</div>
          <div className="stat-info">
            <span className="stat-val">{pendingCount}</span>
            <span className="stat-lbl">Pending</span>
          </div>
        </div>
      </div>

      {/* Filters & Search controls */}
      <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          
          {/* Search bar */}
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="search-input"
            />
          </div>

          {/* Status Filters */}
          <div className="dashboard-filters">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
              id="filter-all"
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
              id="filter-pending"
            >
              Pending
            </button>
            <button
              className={`filter-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
              id="filter-completed"
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Task Grid content area */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredTasks.length === 0 ? (
        <div className="glass-card empty-state" id="empty-state">
          <span className="empty-state-icon">📂</span>
          <h3>No tasks found</h3>
          <p style={{ marginTop: "0.5rem", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            {searchQuery || filter !== "all"
              ? "Try adjusting your filters or search criteria."
              : "Let's kick things off! Create your first task to stay organized."}
          </p>
          {(searchQuery || filter !== "all") ? (
            <button 
              className="btn btn-secondary" 
              onClick={() => { setSearchQuery(""); setFilter("all"); }}
              id="reset-filters-btn"
            >
              Clear Filters
            </button>
          ) : (
            <Link to="/new" className="btn btn-primary" id="empty-state-add-btn">
              Create a Task
            </Link>
          )}
        </div>
      ) : (
        <div className="task-grid" id="task-grid-container">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
