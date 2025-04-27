const db = require('./db');
const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');

const AGGR_TIME = 60; // seconds
const BARK_TEXT = "Woof!";

const emitter = new EventEmitter();

const context = {
  text: "",
  timer: null,
  id: null,
};

const sendNotification = () => {
  const now = new Date().toISOString();

  if (context.timer) {
    // Append to current text
    context.text += " " + BARK_TEXT;
    console.log("appended bark");

    // Update existing DB row
    const updateStmt = db.prepare(`
      UPDATE messages
      SET text = ?, update_time = ?
      WHERE id = ?
    `);
    updateStmt.run(context.text, now, context.id);

  } else {
    // New aggregation window
    console.log("new bark started");
    context.text = BARK_TEXT;
    context.id = uuidv4();

    // Insert new message into DB
    const insertStmt = db.prepare(`
      INSERT INTO messages (id, text, create_time, update_time)
      VALUES (?, ?, ?, ?)
    `);
    insertStmt.run(context.id, context.text, now, now);

    // Start aggregation timer
    context.timer = setTimeout(() => {
      context.text = "";
      context.timer = null;
      context.id = null;
      emitter.emit('reset');
    }, AGGR_TIME * 1000);
  }

  return Promise.resolve(); // to keep test-hey.js compatible
};

module.exports = {
  send: sendNotification,
  on: emitter.on.bind(emitter),
};
