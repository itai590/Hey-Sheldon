const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const SoundDetector = require('./sound-detector');
const hey = require('./hey');
const syncHey = require('./sync-hey');

// === CONFIG ===
const configPath = path.resolve(__dirname, 'config.json');
const config = { MAX_RMS_AMPLITUDE: 0.5 };

if (fs.existsSync(configPath)) {
  try {
    Object.assign(config, JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8' })));
    console.log("MAX_RMS_AMPLITUDE:", config.MAX_RMS_AMPLITUDE);
  } catch (err) {
    console.error("Couldn't read config.json", err);
  }
}

// === SOUND DETECTOR SETUP ===
let detections = 0;
const soundDetector = new SoundDetector(config);

soundDetector.start();

hey.on('reset', () => {
  console.log("Resetting detections");
  detections = 0;
});

soundDetector.on("detected", ({ duration, max, rms }) => {
  console.log(timestamp() + "detected", rms, "detections:", detections);
  if (rms > config.MAX_RMS_AMPLITUDE) {
    if (++detections > 2) {
      hey.send();
    }
  }
});

function timestamp() {
  let ts = Date();
  ts = ts.replace(/GMT.*/g, "");
  return ts + "|";
}

// === PRESENCE HEARTBEAT ===
setInterval(syncHey, 60 * 1000);
syncHey();

// === EXPRESS SERVER SETUP ===
const app = express();
const PORT = 5100;

app.use(cors());
app.use(express.json()); // <== ADD THIS to parse JSON bodies

// === API ===

// List messages
app.get('/api/messages', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM messages ORDER BY update_time DESC`);
    const messages = stmt.all();
    res.json(messages);
  } catch (err) {
    console.error("DB read error:", err);
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

// Update or Insert messages
app.put('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!id || !text) {
    return res.status(400).json({ error: 'Missing id or text' });
  }

  try {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO messages (id, text, create_time, update_time)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        text = excluded.text,
        update_time = excluded.update_time
    `);
    stmt.run(id, text, now, now);

    res.json({ success: true });
  } catch (err) {
    console.error("DB insert/update error:", err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// === Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running: sound detection + API at http://localhost:${PORT}`);
});
