const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    course: { type: String, required: true, trim: true },
    year: { type: String, required: true, default: "1st Year" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);