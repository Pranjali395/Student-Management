import React from "react";

export default function StudentDetails({ student, onClose }) {
  if (!student) return null;

  const status = student.status || "Active";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="student-details"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="details-header">
          <div>
            <h2>Student Profile</h2>
            <p>Student details and information</p>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="profile-section">
          <div className="profile-avatar">
            {student.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{student.name}</h3>

            <span
              className={`status-badge ${
                status === "Inactive"
                  ? "status-inactive"
                  : "status-active"
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-box">
            <span>Email</span>
            <strong>{student.email}</strong>
          </div>

          <div className="detail-box">
            <span>Course</span>
            <strong>{student.course}</strong>
          </div>

          <div className="detail-box">
            <span>Academic Year</span>
            <strong>{student.year}</strong>
          </div>

          <div className="detail-box">
            <span>Status</span>
            <strong>{status}</strong>
          </div>
        </div>

        <button className="btn btn-primary details-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}