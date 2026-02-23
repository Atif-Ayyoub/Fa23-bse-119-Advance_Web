const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
    process.exit(1);
  }
});

// Create table if not exists
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  dob TEXT,
  gender TEXT,
  address TEXT,
  username TEXT,
  password TEXT
)
`);

// Handle form submit
app.post('/save', (req, res) => {
  const { firstName, lastName, email, phone, dob, gender, address, username, password } = req.body;
  db.run(
    'INSERT INTO users (first_name, last_name, email, phone, dob, gender, address, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [firstName, lastName, email, phone, dob || null, gender, address, username, password],
    function (err) {
      if (err) {
        console.error('Insert error:', err.message);
        return res.status(500).send(err.message);
      }
      res.send('Data Inserted Successfully ✅');
    }
  );
});

// CRUD endpoints
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/users/:id', (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

app.put('/users/:id', (req, res) => {
  const { firstName, lastName, email, phone, dob, gender, address, username, password } = req.body;
  db.run(
    'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, dob = ?, gender = ?, address = ?, username = ?, password = ? WHERE id = ?',
    [firstName, lastName, email, phone, dob || null, gender, address, username, password, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

app.delete('/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
