const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all items
router.get('/', (req, res) => {
  const query = 'SELECT * FROM items ORDER BY category, name';
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// Search items by name or category
router.get('/search', (req, res) => {
  const { query: searchQuery } = req.query;
  const sql = `SELECT * FROM items WHERE name LIKE ? OR category LIKE ? ORDER BY category, name`;
  db.all(sql, [`%${searchQuery}%`, `%${searchQuery}%`], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// Get item by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM items WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json(row);
  });
});

// Add new item
router.post('/', (req, res) => {
  const { name, category, total_quantity } = req.body;

  if (!name || !category || !total_quantity) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const query = `INSERT INTO items (name, category, total_quantity, available_quantity) VALUES (?, ?, ?, ?)`;
  db.run(query, [name, category, total_quantity, total_quantity], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      id: this.lastID,
      name,
      category,
      total_quantity,
      available_quantity: total_quantity
    });
  });
});

// Update item
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, total_quantity } = req.body;

  const query = `UPDATE items SET name = ?, category = ?, total_quantity = ? WHERE id = ?`;
  db.run(query, [name, category, total_quantity, id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item updated successfully' });
  });
});

// Delete item
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // Check if item has open transactions
  const checkQuery = 'SELECT COUNT(*) as count FROM transactions WHERE item_id = ? AND status = "issued"';
  db.get(checkQuery, [id], (err, row) => {
    if (row?.count > 0) {
      res.status(400).json({ error: 'Cannot delete item with active transactions' });
      return;
    }

    const query = 'DELETE FROM items WHERE id = ?';
    db.run(query, [id], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: 'Item deleted successfully' });
    });
  });
});

// Get item statistics
router.get('/stats/overview', (req, res) => {
  const query = `
    SELECT 
      SUM(total_quantity) as totalItems,
      SUM(available_quantity) as availableItems,
      (SUM(total_quantity) - SUM(available_quantity)) as issuedItems
    FROM items
  `;
  db.get(query, [], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      totalItems: row?.totalItems || 0,
      availableItems: row?.availableItems || 0,
      issuedItems: row?.issuedItems || 0
    });
  });
});

module.exports = router;
