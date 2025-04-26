const db = require('./db');
const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');

const AGGR_TIME = 60; // seconds
const BARK_TEXT = "Woof!";

const emitter = new EventEmitter();

const context = {
  text: "",
  timer: null
};

const sendNotification = () => {
  const now = new Date().toISOString();

  if (context.timer) {
    // Append to current session
    context.text += " " + BARK_TEXT;
    console.log("appended bark");
  } else {
    // New bark detected
    context.text = BARK_TEXT;
    console.log("new bark started");
  }

  // Always insert a new message
  const insertStmt = db.prepare(`
    INSERT INTO messages (id, text, create_time, update_time)
    VALUES (?, ?, ?, ?)
  `);
  insertStmt.run(uuidv4(), context.text, now, now);

  // Set aggregation timer
  if (!context.timer) {
    context.timer = setTimeout(() => {
      context.text = "";
      context.timer = null;
      emitter.emit('reset');
    }, AGGR_TIME * 1000);
  }

  return Promise.resolve(); // to keep test-hey.js compatible
};

module.exports = {
  send: sendNotification,
  on: emitter.on.bind(emitter),
};
