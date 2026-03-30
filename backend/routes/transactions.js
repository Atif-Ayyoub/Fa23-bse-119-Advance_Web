const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all transactions
router.get('/', (req, res) => {
  const query = `
    SELECT 
      t.id, t.student_id, t.item_id, t.quantity, 
      t.issue_date, t.return_date, t.status,
      s.name as student_name, s.roll_no, s.student_id as student_code,
      i.name as item_name, i.category
    FROM transactions t
    JOIN students s ON t.student_id = s.id
    JOIN items i ON t.item_id = i.id
    ORDER BY t.issue_date DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// Get issued items (not yet returned)
router.get('/issued', (req, res) => {
  const query = `
    SELECT 
      t.id, t.student_id, t.item_id, t.quantity, 
      t.issue_date, t.status,
      s.name as student_name, s.roll_no, s.student_id as student_code,
      i.name as item_name, i.category
    FROM transactions t
    JOIN students s ON t.student_id = s.id
    JOIN items i ON t.item_id = i.id
    WHERE t.status = 'issued'
    ORDER BY t.issue_date DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// Issue item
router.post('/issue', (req, res) => {
  const { student_id, item_id, quantity, issue_date, expected_return_date } = req.body;

  if (!student_id || !item_id || !quantity || !issue_date) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Check if item has enough available quantity
  const itemQuery = 'SELECT available_quantity FROM items WHERE id = ?';
  db.get(itemQuery, [item_id], (err, item) => {
    if (err || !item) {
      res.status(400).json({ error: 'Item not found' });
      return;
    }

    if (item.available_quantity < quantity) {
      res.status(400).json({ error: 'Insufficient quantity available' });
      return;
    }

    // Create transaction
    const transQuery = `
      INSERT INTO transactions (student_id, item_id, quantity, issue_date, return_date, status)
      VALUES (?, ?, ?, ?, ?, 'issued')
    `;
    db.run(transQuery, [student_id, item_id, quantity, issue_date, expected_return_date], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      // Update available quantity
      const updateQuery = 'UPDATE items SET available_quantity = available_quantity - ? WHERE id = ?';
      db.run(updateQuery, [quantity, item_id], (err) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({
          id: this.lastID,
          student_id,
          item_id,
          quantity,
          status: 'issued'
        });
      });
    });
  });
});

// Return item
router.post('/return', (req, res) => {
  const { transaction_id, return_date } = req.body;

  if (!transaction_id || !return_date) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Get transaction details
  const getQuery = 'SELECT quantity, item_id FROM transactions WHERE id = ? AND status = "issued"';
  db.get(getQuery, [transaction_id], (err, transaction) => {
    if (err || !transaction) {
      res.status(400).json({ error: 'Transaction not found or already returned' });
      return;
    }

    // Update transaction status
    const updateTransQuery = 'UPDATE transactions SET return_date = ?, status = "returned" WHERE id = ?';
    db.run(updateTransQuery, [return_date, transaction_id], (err) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      // Update available quantity
      const updateItemQuery = 'UPDATE items SET available_quantity = available_quantity + ? WHERE id = ?';
      db.run(updateItemQuery, [transaction.quantity, transaction.item_id], (err) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ message: 'Item returned successfully' });
      });
    });
  });
});

// Get transaction history
router.get('/history/:student_id', (req, res) => {
  const { student_id } = req.params;
  const query = `
    SELECT 
      t.id, t.quantity, t.issue_date, t.return_date, t.status,
      i.name as item_name, i.category
    FROM transactions t
    JOIN items i ON t.item_id = i.id
    WHERE t.student_id = ?
    ORDER BY t.issue_date DESC
  `;
  db.all(query, [student_id], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

module.exports = router;
