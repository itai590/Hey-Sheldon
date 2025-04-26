const Database = require('better-sqlite3');
const db = new Database('./data/hey.db');

const fs = require('fs');
const path = require('path');

// Ensure data/ directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
    console.log(`[INIT] 📂 Created missing 'data/' directory`);
}


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