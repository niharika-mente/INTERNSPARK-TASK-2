import React from "react";

export default function LoadingSpinner({ message = "Loading tasks..." }) {
  return (
    <div className="loading-container animate-fade-in" id="loading-spinner">
      <div className="spinner"></div>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>{message}</p>
    </div>
  );
}
