import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isEditMode) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/${id}`);
        setTitle(res.data.title || "");
        setDescription(res.data.description || "");
        setCompleted(res.data.completed || false);
      } catch (err) {
        console.error(err);
        setError("Failed to load task details for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, isEditMode]);

  const validateForm = () => {
    const errors = {};
    
    // Title validation: min 3, max 50, not empty
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      errors.title = "Title is required and cannot be empty";
    } else if (trimmedTitle.length < 3) {
      errors.title = "Title must be at least 3 characters";
    } else if (trimmedTitle.length > 50) {
      errors.title = "Title cannot exceed 50 characters";
    }

    // Description validation: min 5, max 200, not empty
    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      errors.description = "Description is required and cannot be empty";
    } else if (trimmedDesc.length < 5) {
      errors.description = "Description must be at least 5 characters";
    } else if (trimmedDesc.length > 200) {
      errors.description = "Description cannot exceed 200 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        title: title.trim(),
        description: description.trim(),
        completed,
      };

      if (isEditMode) {
        await API.put(`/${id}`, payload);
      } else {
        await API.post("/", payload);
      }

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        // Handle express validator issues if backend returns specific errors array
        const serverErrors = {};
        err.response.data.errors.forEach((e) => {
          serverErrors[e.path || e.param] = e.msg;
        });
        setFieldErrors(serverErrors);
        setError("Please correct the highlighted issues.");
      } else {
        setError(
          `Failed to ${isEditMode ? "update" : "create"} task. Please check server validation rules.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching task details..." />;
  }

  return (
    <div className="details-container animate-fade-in" id="task-form-view">
      <Link to={isEditMode ? `/task/${id}` : "/"} className="btn btn-secondary" style={{ marginBottom: "1.5rem" }} id="form-cancel-top-btn">
        ← Cancel
      </Link>

      <div className="glass-card" style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1.5rem" }} className="gradient-text" id="form-heading">
          {isEditMode ? "Edit Task" : "Create New Task"}
        </h2>

        {error && (
          <div className="error-banner" id="form-error-banner">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} id="task-form">
          {/* Title Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Title</label>
            <input
              type="text"
              id="task-title"
              className="form-control"
              placeholder="e.g. Implement User Auth"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) {
                  setFieldErrors((prev) => ({ ...prev, title: null }));
                }
              }}
              disabled={submitting}
              maxLength={60}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="form-error-msg" id="title-error">{fieldErrors.title}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "flex-end" }}>
                {title.length}/50
              </span>
            </div>
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              className="form-control"
              placeholder="e.g. Set up JWT middleware and encrypt passwords in the backend database."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (fieldErrors.description) {
                  setFieldErrors((prev) => ({ ...prev, description: null }));
                }
              }}
              disabled={submitting}
              maxLength={250}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="form-error-msg" id="desc-error">{fieldErrors.description}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "flex-end" }}>
                {description.length}/200
              </span>
            </div>
          </div>

          {/* Completed Checkbox (only in Edit Mode or as an option in create) */}
          <div className="form-group" style={{ margin: "1rem 0" }}>
            <label className="custom-checkbox" id="form-completed-label">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                disabled={submitting}
                id="form-completed-checkbox"
              />
              <span className="checkbox-checkmark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span style={{ fontWeight: 550, fontSize: "0.95rem" }}>
                Mark as Completed
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "flex-end" }}>
            <Link to={isEditMode ? `/task/${id}` : "/"} className="btn btn-secondary" id="form-cancel-btn">
              Cancel
            </Link>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              id="form-submit-btn"
            >
              {submitting ? "Saving..." : isEditMode ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
