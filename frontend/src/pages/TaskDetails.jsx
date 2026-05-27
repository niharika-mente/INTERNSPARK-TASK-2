import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/${id}`);
        setTask(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load task details. The task might not exist or the backend is offline.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleToggleCompleted = async () => {
    if (!task) return;
    try {
      setUpdating(true);
      const res = await API.put(`/${id}`, {
        ...task,
        completed: !task.completed,
      });
      setTask(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to update task completion state.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      setUpdating(true);
      await API.delete(`/${id}`);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to delete task.");
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching task details..." />;
  }

  if (error || !task) {
    return (
      <div className="glass-card animate-fade-in" style={{ padding: "3rem 2rem", textAlign: "center" }} id="details-error">
        <span style={{ fontSize: "3rem" }}>⚠️</span>
        <h3 style={{ marginTop: "1rem", color: "var(--color-danger)" }}>Error Loading Details</h3>
        <p style={{ margin: "1rem 0", color: "var(--text-muted)" }}>{error || "Task not found."}</p>
        <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    );
  }

  // Formatting dates
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  return (
    <div className="details-container animate-fade-in" id="task-details-view">
      {/* Back button */}
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: "1.5rem" }} id="details-back-btn">
        ← Back to Dashboard
      </Link>

      <div className="glass-card">
        {/* Header */}
        <div className="details-header">
          <div>
            <span 
              className={`badge ${task.completed ? "badge-success" : "badge-warning"}`}
              style={{ marginBottom: "0.75rem" }}
              id="details-status-badge"
            >
              {task.completed ? "Completed" : "Pending"}
            </span>
            <h2 id="details-title" style={{ fontSize: "1.75rem", wordBreak: "break-word" }}>{task.title}</h2>
          </div>

          <label className="custom-checkbox" id="details-complete-toggle">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleCompleted}
              disabled={updating}
            />
            <span className="checkbox-checkmark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
              {task.completed ? "Mark as Pending" : "Mark as Completed"}
            </span>
          </label>
        </div>

        {/* Body */}
        <div className="details-body">
          <div className="details-desc-label">Description</div>
          <div className="details-desc" id="details-description">
            {task.description || "No description provided for this task."}
          </div>

          {/* Meta Info */}
          <div className="details-meta">
            <div className="details-meta-item">
              <span className="meta-label">Task ID</span>
              <span className="meta-value" style={{ fontFamily: "monospace", fontSize: "0.85rem", opacity: 0.8 }} id="details-id">
                {task._id}
              </span>
            </div>
            <div className="details-meta-item">
              <span className="meta-label">Created At</span>
              <span className="meta-value" id="details-created-at">{formatDate(task.createdAt)}</span>
            </div>
            <div className="details-meta-item">
              <span className="meta-label">Last Updated</span>
              <span className="meta-value" id="details-updated-at">{formatDate(task.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="details-footer">
          <button 
            onClick={handleDelete} 
            className="btn btn-danger"
            disabled={updating}
            id="details-delete-btn"
          >
            Delete Task
          </button>
          
          <Link 
            to={`/edit/${task._id}`} 
            className="btn btn-primary"
            id="details-edit-btn"
          >
            Edit Details
          </Link>
        </div>
      </div>
    </div>
  );
}
