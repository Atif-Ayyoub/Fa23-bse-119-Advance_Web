const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// Get all students
router.get('/', (req, res) => {
  const query = 'SELECT * FROM students ORDER BY created_at DESC';
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// Search students by name or roll number
router.get('/search', (req, res) => {
  const { query } = req.query;
  const searchQuery = `SELECT * FROM students WHERE name LIKE ? OR roll_no LIKE ? ORDER BY created_at DESC`;
  db.all(searchQuery, [`%${query}%`, `%${query}%`], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// Get student by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM students WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json(row);
  });
});

// Add new student
router.post('/', (req, res) => {
  const { name, roll_no, class: studentClass, phone } = req.body;
  const student_id = `STU-${uuidv4().slice(0, 8).toUpperCase()}`;

  if (!name || !roll_no || !studentClass || !phone) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const query = `INSERT INTO students (student_id, name, roll_no, class, phone) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [student_id, name, roll_no, studentClass, phone], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        res.status(400).json({ error: 'Roll number already exists' });
      } else {
        res.status(400).json({ error: err.message });
      }
      return;
    }
    res.json({
      id: this.lastID,
      student_id,
      name,
      roll_no,
      class: studentClass,
      phone
    });
  });
});

// Update student
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, roll_no, class: studentClass, phone } = req.body;

  const query = `UPDATE students SET name = ?, roll_no = ?, class = ?, phone = ? WHERE id = ?`;
  db.run(query, [name, roll_no, studentClass, phone, id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Student updated successfully' });
  });
});

// Delete student
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM students WHERE id = ?';
  db.run(query, [id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Student deleted successfully' });
  });
});

// Count active students
router.get('/stats/count', (req, res) => {
  const query = 'SELECT COUNT(*) as count FROM students WHERE id IN (SELECT DISTINCT student_id FROM transactions WHERE status = "issued")';
  db.get(query, [], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ activeStudents: row?.count || 0 });
  });
});

// Bulk import students
router.post('/bulk/import', (req, res) => {
  const { students } = req.body;

  if (!Array.isArray(students) || students.length === 0) {
    res.status(400).json({ error: 'Invalid data format. Expected array of students.' });
    return;
  }

  let successCount = 0;
  let errorCount = 0;
  let errors = [];

  // Insert students one by one
  students.forEach((student, index) => {
    const { name, roll_no, class: studentClass, phone } = student;

    // Validate required fields
    if (!name || !roll_no || !studentClass || !phone) {
      errorCount++;
      errors.push(`Row ${index + 1}: Missing required fields`);
      return;
    }

    const student_id = `STU-${uuidv4().slice(0, 8).toUpperCase()}`;
    const query = `INSERT INTO students (student_id, name, roll_no, class, phone) VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [student_id, name, roll_no, studentClass, phone], function(err) {
      if (err) {
        errorCount++;
        errors.push(`Row ${index + 1} (${name}): ${err.message}`);
      } else {
        successCount++;
      }
    });
  });

  // Send response after a brief delay to ensure all inserts complete
  setTimeout(() => {
    res.json({
      message: 'Import completed',
      successCount,
      errorCount,
      totalCount: students.length,
      errors: errors.length > 0 ? errors : []
    });
  }, 500);
});

module.exports = router;
