const Database = require('better-sqlite3');
const db = new Database('./hey.db');

// Create tables on startup
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    text TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS presence (
    id TEXT PRIMARY KEY,
    last_update DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;