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

const logTime = (message) => {
  const now = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Jerusalem',
    hour12: false,
  });
  console.log(`[${now}] ${message}`);
};

const resetContext = () => {
  logTime('Timer ended — Resetting context');
  context.text = "";
  context.timer = null;
  context.id = null;
  emitter.emit('reset');
};

const startOrRestartTimer = () => {
  if (context.timer) {
    clearTimeout(context.timer);
    logTime('Timer restarted');
  } else {
    logTime('Timer started');
  }
  context.timer = setTimeout(resetContext, AGGR_TIME * 1000);
};

const sendNotification = () => {
  const now = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Jerusalem',
    hour12: false,
  });

  if (context.id) {
    // Already aggregating: append new bark
    context.text += " " + BARK_TEXT;
    logTime('Appended bark');

    const updateStmt = db.prepare(`
      UPDATE messages
      SET text = ?, update_time = ?
      WHERE id = ?
    `);
    updateStmt.run(context.text, new Date().toISOString(), context.id);

  } else {
    // New aggregation window
    logTime('New bark aggregation started');
    context.text = BARK_TEXT;
    context.id = uuidv4();

    const insertStmt = db.prepare(`
      INSERT INTO messages (id, text, create_time, update_time)
      VALUES (?, ?, ?, ?)
    `);
    const nowISO = new Date().toISOString();
    insertStmt.run(context.id, context.text, nowISO, nowISO);
  }

  // Always start or restart the timer
  startOrRestartTimer();

  return Promise.resolve(); // to keep test-hey.js compatible
};

module.exports = {
  send: sendNotification,
  on: emitter.on.bind(emitter),
};
