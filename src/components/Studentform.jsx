import React, { useState } from "react";

const emptyForm = { name: "", email: "", course: "", year: "1st Year" };

// One form handles both "Add" and "Edit".
// If `initialData` is passed, the fields are pre-filled and we're editing.
export default function StudentForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || emptyForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.course.trim()) newErrors.course = "Course is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(formData);
    if (!initialData) setFormData(emptyForm); // clear form only after a fresh "add"
  };

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Ananya Gupta"
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. ananya@example.com"
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="course">Course</label>
        <input
          id="course"
          name="course"
          type="text"
          value={formData.course}
          onChange={handleChange}
          placeholder="e.g. B.Sc Computer Science"
        />
        {errors.course && <span className="field-error">{errors.course}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="year">Year</label>
        <select id="year" name="year" value={formData.year} onChange={handleChange}>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? "Save Changes" : "Add Student"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
