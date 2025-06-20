const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// GET  /api/dogs
// Returns every dog’s name, size, and its owner’s username
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.name AS dog_name,
             d.size,
             u.username AS owner_username
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
    `);
    res.json(rows);                // success → JSON array
  } catch (err) {
    res.status(500).json({ error: err.message }); // error → 500 + message
  }
});

module.exports = router;
