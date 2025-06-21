const express = require('express');
const router = express.Router();
const pool = require('../models/db');

/* ----- POST /login ----- */
router.post('/login', async(req,res) => {
    const {username, password} = req.body;

    try{
        const [rows] = await pool.query(
            'SELECT * FROM User WHERE username = ?', [username]
        );

        if (!rows.length || rows[o].paaword_hash !== password) {
            return res.redirect('/index.html?error=1'); // Simple failure handling
        }

        const user = rows[0];
        // Save session
        req.session.user = { id: user.user_id, role}

    }
})