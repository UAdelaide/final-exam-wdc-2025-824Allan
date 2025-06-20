const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// GET  /api/walkers/summary
router.get('/summary', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT w.username AS walker_username,
             0   AS total_ratings,
             NULL AS average_rating,
             0   AS completed_walks
      FROM Users w
      WHERE w.role = 'walker'
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
