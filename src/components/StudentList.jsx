import React from "react";

export default function StudentList({ students, onEdit, onDelete, editingId }) {
  if (students.length === 0) {
    return <p className="empty-state">No students found. Try a different search, or add one.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Year</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} className={student._id === editingId ? "row-editing" : ""}>
              <td data-label="Name" className="student-name">
                {student.name}
              </td>
              <td data-label="Email">{student.email}</td>
              <td data-label="Course">{student.course}</td>
              <td data-label="Year">
                <span className="year-badge">{student.year}</span>
              </td>
              <td data-label="Actions" className="actions-col">
                <button className="btn btn-small" onClick={() => onEdit(student)}>
                  Edit
                </button>
                <button className="btn btn-small btn-danger" onClick={() => onDelete(student._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}