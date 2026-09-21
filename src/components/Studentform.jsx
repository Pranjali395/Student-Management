import React, { useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  course: "",
  year: "1st Year",
  status: "Active",
};

export default function StudentForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    initialData
      ? {
          ...emptyForm,
          ...initialData,
          status: initialData.status || "Active",
        }
      : emptyForm
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.course.trim()) {
      newErrors.course = "Course is required";
    }

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

    if (!initialData) {
      setFormData(emptyForm);
    }
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
        <select
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
        >
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status || "Active"}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? "Save Changes" : "Add Student"}
        </button>

        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}