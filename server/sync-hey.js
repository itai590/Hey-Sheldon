const db = require('./db');

function syncHey() {
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO presence (id, last_update)
    VALUES (?, ?)
    ON CONFLICT(id) DO UPDATE SET last_update = excluded.last_update
  `);

  try {
    stmt.run('sheldon', now);
    console.log("Presence updated successfully!");
  } catch (err) {
    console.error("Presence update error", err);
  }
}

module.exports = syncHey;
