const mongoose = require("mongoose");

// This defines the shape of a "student" document in MongoDB —
// similar in spirit to the fields in your React StudentForm.
const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    course: { type: String, required: true, trim: true },
    year: { type: String, required: true, default: "1st Year" },
  },
  {
    timestamps: true, // adds createdAt / updatedAt automatically
  }
);

module.exports = mongoose.model("Student", studentSchema);
