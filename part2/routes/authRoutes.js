const express = require('express');
const router  = express.Router();
const pool    = require('../models/db');   // 跟现有 userRoutes 使用同一路径

// POST /login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('[1] Login attempt:', username, password); // 第一步打印用户名密码
    try {
      const [rows] = await pool.query(
        'SELECT user_id, role, password_hash FROM Users WHERE username = ?',
        [username]
      );
      console.log('[2] Query result:', rows); // 第二步打印查询结果

      if (!rows.length) {
        console.log('[3] User not found');
        return res.redirect('/index.html?error=1');
      }

      const user = rows[0];
      if (password !== user.password_hash) {
        console.log('[4] Wrong password');
        return res.redirect('/index.html?error=1');
      }

      console.log('[5] Login success. User role:', user.role);

      // 测试 session 是否可用
      req.session.user = { id: user.user_id, role: user.role };
      console.log('[6] Session object after set:', req.session);

      // Redirect
      if (user.role === 'owner') {
        console.log('[7] Redirecting to /owner-dashboard.html');
        return res.redirect('/owner-dashboard.html');
      } else {
        console.log('[7] Redirecting to /walker-dashboard.html');
        return res.redirect('/walker-dashboard.html');
      }

    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).send('Server error');
    }
  });

module.exports = router;
