const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login (dummy version)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE email = ? AND password_hash = ?
    `, [email, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

//  New route: Get list of dogs for the logged-in owner
router.get('/my-dogs', async (req, res) => {
  const user = req.session.user;

  // Check login & role
  if (!user || user.role !== 'owner') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    // Query all dogs owned by this user
    const [rows] = await db.query(
      'SELECT dog_id, name FROM Dogs WHERE owner_id = ?',
      [user.id]
    );
    res.json(rows); // Return dog_id and name
  } catch (error) {
    console.error('Failed to fetch dogs:', error);
    res.status(500).json({ error: 'Failed to load dogs' });
  }
});

// GET all registered dogs (for homepage display)
router.get('/dogs', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT dog_id, name, size, owner_id FROM Dogs'
    );
    res.json(rows); // Send back dog list as JSON
  } catch (error) {
    console.error('Error fetching dogs:', error);
    res.status(500).json({ error: 'Failed to load dogs' });
  }
});

module.exports = router;