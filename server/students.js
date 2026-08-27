const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// GET /api/students  -> list all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students", error: err.message });
  }
});

// POST /api/students  -> create a new student
router.post("/", async (req, res) => {
  try {
    const { name, email, course, year } = req.body;
    const student = new Student({ name, email, course, year });
    const saved = await student.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Failed to create student", error: err.message });
  }
});

// PUT /api/students/:id  -> update an existing student
router.put("/:id", async (req, res) => {
  try {
    const { name, email, course, year } = req.body;
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, course, year },
      { new: true, runValidators: true } // return the updated doc, not the old one
    );
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update student", error: err.message });
  }
});

// DELETE /api/students/:id  -> remove a student
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete student", error: err.message });
  }
});

module.exports = router;
