const express = require('express');
const router  = express.Router();
const pool    = require('../models/db');   // 跟现有 userRoutes 使用同一路径

// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;      // 表单字段名必须是这两个
  try {
    // 1. 查找用户
    const [rows] = await pool.query(
      'SELECT user_id, role, password_hash FROM Users WHERE username = ?',
      [username]
    );
    if (!rows.length) {
      return res.redirect('/index.html?error=1');
    }

    const user = rows[0];

    // 2. 简单比对密码（考试无需加密比对）
    if (password !== user.password_hash) {
      return res.redirect('/index.html?error=1');
    }

    // 3. 登录成功 -> 写 session
    req.session.user = { id: user.user_id, role: user.role };

    // 4. 按角色重定向
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

module.exports = router;
