const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5100;

app.use(cors());

// Serve message history
app.get('/api/messages', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM messages ORDER BY update_time DESC`);
    const messages = stmt.all();
    res.json(messages);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

app.listen(PORT, () => {
  console.log(`🐾 SQLite API running at http://localhost:${PORT}`);
});
