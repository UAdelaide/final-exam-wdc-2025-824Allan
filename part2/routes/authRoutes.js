const express = require('express');
const router  = express.Router();
const pool    = require('../models/db');

// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Search for users
    const [rows] = await pool.query(
      'SELECT user_id, role, password_hash FROM Users WHERE username = ?',
      [username]
    );
    if (!rows.length) {
      return res.redirect('/index.html?error=1');
    }

    const user = rows[0];

    // Simple password comparison
    if (password !== user.password_hash) {
      return res.redirect('/index.html?error=1');
    }

    // Login successful -> Write session
    req.session.user = { id: user.user_id, role: user.role };

    // Redirect by role
    if (user.role === 'owner') {
      return res.redirect('/owner-dashboard.html');
    } else {
      return res.redirect('/walker-dashboard.html');
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).send('Server error');
  }
});


// Added logout route to destroy session and redirect to login page
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).send('Logout failed');
      }
      res.clearCookie('connect.sid');   // Clear session cookie
      res.redirect('/index.html');      // Return to login form
    });
  });

module.exports = router;
