import React from "react";
import { Link } from "react-router-dom";

export default function TaskCard({ task, onToggle, onDelete }) {
  return (
    <div className="glass-card animate-scale-in" style={{ height: "100%" }} id={`task-card-${task._id}`}>
      <div className="task-card-inner">
        <div>
          <div className="task-card-header">
            <label className="custom-checkbox" id={`task-toggle-label-${task._id}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task)}
                id={`task-checkbox-${task._id}`}
              />
              <span className="checkbox-checkmark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            </label>
            
            <Link 
              to={`/task/${task._id}`} 
              className={`task-card-title ${task.completed ? "completed" : ""}`}
              id={`task-title-link-${task._id}`}
            >
              {task.title}
            </Link>
          </div>

          <p className="task-card-desc" id={`task-desc-${task._id}`}>
            {task.description || "No description provided."}
          </p>
        </div>

        <div className="task-card-footer">
          <span 
            className={`badge ${task.completed ? "badge-success" : "badge-warning"}`}
            id={`task-badge-${task._id}`}
          >
            {task.completed ? "Completed" : "Pending"}
          </span>

          <div className="task-card-actions">
            <Link 
              to={`/task/${task._id}`} 
              className="action-btn" 
              title="View Details"
              id={`task-view-btn-${task._id}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
            </Link>

            <Link 
              to={`/edit/${task._id}`} 
              className="action-btn" 
              title="Edit Task"
              id={`task-edit-btn-${task._id}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </Link>

            <button 
              onClick={() => onDelete(task._id)} 
              className="action-btn delete" 
              title="Delete Task"
              id={`task-delete-btn-${task._id}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
