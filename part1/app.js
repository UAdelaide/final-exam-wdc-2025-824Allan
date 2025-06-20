const express = require('express');
const pool    = require('./db');

const app  = express();
const port = 8080;

const path    = require('path');

app.use(express.static(path.join(__dirname, 'public')));

/* ---------- Mount the three routes ---------- */
app.use('/api/dogs',         require('./routes/dogs'));
app.use('/api/walkrequests', require('./routes/walkrequests'));
app.use('/api/walkers',      require('./routes/walkers'));

/* ---------- Start server ---------- */
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
