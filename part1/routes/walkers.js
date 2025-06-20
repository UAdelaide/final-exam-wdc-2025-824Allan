const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// GET  /api/walkers/summary
router.get('/summary', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT w.username AS walker_username,
               COUNT(r.rating_id)                AS total_ratings,
               ROUND(AVG(r.rating), 1)           AS average_rating,
               SUM(CASE WHEN wr.status='completed' THEN 1 ELSE 0 END) AS completed_walks
        FROM Users w
        LEFT JOIN WalkApplications wa ON wa.walker_id = w.user_id
        LEFT JOIN WalkRequests    wr ON wr.request_id = wa.request_id
        LEFT JOIN WalkRatings     r  ON r.request_id  = wr.request_id
        WHERE w.role = 'walker'
        GROUP BY w.user_id
      `);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


module.exports = router;
