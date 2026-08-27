import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "./App.css";

const API_URL = "/api/students";

export default function App() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load students from the API once when the app starts
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to load students");
      const data = await res.json();
      setStudents(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (studentData) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      if (!res.ok) throw new Error("Failed to add student");
      const newStudent = await res.json();
      setStudents((prev) => [newStudent, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStudent = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update student");
      const updated = await res.json();
      setStudents((prev) => prev.map((s) => (s._id === id ? updated : s)));
      setEditingStudent(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteStudent = async (id) => {
    const confirmed = window.confirm("Delete this student? This cannot be undone.");
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");
      setStudents((prev) => prev.filter((s) => s._id !== id));
      if (editingStudent?._id === id) setEditingStudent(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormSubmit = (studentData) => {
    if (editingStudent) {
      updateStudent(editingStudent._id, studentData);
    } else {
      addStudent(studentData);
    }
  };

  const startEditing = (student) => setEditingStudent(student);
  const cancelEditing = () => setEditingStudent(null);

  const filteredStudents = students.filter((student) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      student.name.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term) ||
      student.course.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page">
      <header className="page-header">
        <h1>Student Management</h1>
        <p className="subtitle">Add, search, and manage student records</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <main className="layout">
        <section className="panel form-panel">
          <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
          <StudentForm
            key={editingStudent ? editingStudent._id : "new"}
            initialData={editingStudent}
            onSubmit={handleFormSubmit}
            onCancel={editingStudent ? cancelEditing : null}
          />
        </section>

        <section className="panel list-panel">
          <div className="list-panel-header">
            <h2>Students ({filteredStudents.length})</h2>
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>

          {loading ? (
            <p className="empty-state">Loading students...</p>
          ) : (
            <StudentList
              students={filteredStudents}
              onEdit={startEditing}
              onDelete={deleteStudent}
              editingId={editingStudent?._id ?? null}
            />
          )}
        </section>
      </main>
    </div>
  );
}