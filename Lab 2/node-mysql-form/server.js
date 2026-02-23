const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbModule = require('./db');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', (req, res) => {
  const { firstName, lastName, email, phone, dob, gender, address, username, password } = req.body;
  const sql = 'INSERT INTO users (first_name, last_name, email, phone, dob, gender, address, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const db = dbModule.getDB();
  db.query(sql, [firstName, lastName, email, phone, dob || null, gender, address, username, password], (err) => {
    if (err) {
      console.error('Insert error:', err.message);
      return res.status(500).send(err.message);
    }
    res.send('Data Inserted Successfully ✅');
  });
});

// CRUD endpoints
app.get('/users', (req, res) => {
  const db = dbModule.getDB();
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/users/:id', (req, res) => {
  const db = dbModule.getDB();
  db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(results[0]);
  });
});

app.put('/users/:id', (req, res) => {
  const { firstName, lastName, email, phone, dob, gender, address, username, password } = req.body;
  const db = dbModule.getDB();
  db.query(
    'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, dob = ?, gender = ?, address = ?, username = ?, password = ? WHERE id = ?',
    [firstName, lastName, email, phone, dob || null, gender, address, username, password, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ affectedRows: result.affectedRows });
    }
  );
});

app.delete('/users/:id', (req, res) => {
  const db = dbModule.getDB();
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ affectedRows: result.affectedRows });
  });
});

const PORT = process.env.PORT || 3000;

// Wait for DB ready before starting server
dbModule.ensureDatabaseAndTable()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err.message);
    process.exit(1);
  });
