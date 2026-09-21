import React, { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import StudentDetails from "./components/StudentDetails";
import "./App.css";

const API_URL = "/api/students";

export default function App() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // GET STUDENTS
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error("Failed to load students");
      }

      const data = await res.json();

      setStudents(
        Array.isArray(data)
          ? data
          : Array.isArray(data.students)
          ? data.students
          : []
      );

      setError("");
    } catch (err) {
      console.error("Fetch students error:", err);
      setError(err.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ADD STUDENT
  const addStudent = async (studentData) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...studentData,
          status: studentData.status || "Active",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add student");
      }

      const newStudent = await res.json();

      setStudents((prev) => [newStudent, ...prev]);
      setError("");
    } catch (err) {
      console.error("Add student error:", err);
      setError(err.message);
    }
  };

  // UPDATE STUDENT
  const updateStudent = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedData,
          status: updatedData.status || "Active",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update student");
      }

      const updatedStudent = await res.json();

      setStudents((prev) =>
        prev.map((student) =>
          student._id === id ? updatedStudent : student
        )
      );

      setEditingStudent(null);
      setError("");
    } catch (err) {
      console.error("Update student error:", err);
      setError(err.message);
    }
  };

  // DELETE STUDENT
  const deleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Delete this student? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete student");
      }

      setStudents((prev) =>
        prev.filter((student) => student._id !== id)
      );

      if (editingStudent?._id === id) {
        setEditingStudent(null);
      }

      if (selectedStudent?._id === id) {
        setSelectedStudent(null);
      }

      setError("");
    } catch (err) {
      console.error("Delete student error:", err);
      setError(err.message);
    }
  };

  // FORM SUBMIT
  const handleFormSubmit = (studentData) => {
    if (editingStudent) {
      updateStudent(editingStudent._id, studentData);
    } else {
      addStudent(studentData);
    }
  };

  // EDIT
  const startEditing = (student) => {
    setEditingStudent({
      ...student,
      status: student.status || "Active",
    });
  };

  const cancelEditing = () => {
    setEditingStudent(null);
  };

  // SEARCH + STATUS FILTER
  const filteredStudents = students.filter((student) => {
    const term = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !term ||
      student.name?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.course?.toLowerCase().includes(term);

    const studentStatus = student.status || "Active";

    const matchesStatus =
      statusFilter === "All" ||
      studentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page">
      <header className="page-header">
        <h1>Student Management</h1>

        <p className="subtitle">
          Add, search, and manage student records
        </p>
      </header>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <main className="layout">

        {/* ADD / EDIT FORM */}
        <section className="panel form-panel">
          <h2>
            {editingStudent ? "Edit Student" : "Add Student"}
          </h2>

          <StudentForm
            key={editingStudent ? editingStudent._id : "new"}
            initialData={editingStudent}
            onSubmit={handleFormSubmit}
            onCancel={editingStudent ? cancelEditing : null}
          />
        </section>

        {/* STUDENT LIST */}
        <section className="panel list-panel">

          <div className="list-panel-header">
            <div>
              <h2>
                Students ({filteredStudents.length})
              </h2>

              <p className="list-subtitle">
                Manage and view student records
              </p>
            </div>

            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          {/* STATUS FILTER */}
          <div className="filter-section">
            <span className="filter-label">
              Filter by status:
            </span>

            <div className="filter-buttons">
              {["All", "Active", "Inactive"].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`filter-btn ${
                    statusFilter === status
                      ? "filter-active"
                      : ""
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* STUDENT TABLE */}
          {loading ? (
            <p className="empty-state">
              Loading students...
            </p>
          ) : (
            <StudentList
              students={filteredStudents}
              onEdit={startEditing}
              onDelete={deleteStudent}
              onView={setSelectedStudent}
              editingId={editingStudent?._id || null}
            />
          )}

        </section>
      </main>

      {/* STUDENT PROFILE MODAL */}
      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}