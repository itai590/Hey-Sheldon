const db = require('./db');
const EventEmitter = require('events');

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
    // Append and update
    context.text += " " + BARK_TEXT;

    const updateStmt = db.prepare(`
      UPDATE messages
      SET text = ?, update_time = ?
      WHERE id = ?
    `);
    updateStmt.run(context.text, now, 'sheldon');

    console.log("updated hey!");
  } else {
    // Start new message
    context.text = BARK_TEXT;

    const insertStmt = db.prepare(`
      INSERT INTO messages (id, text, create_time, update_time)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        text = excluded.text,
        update_time = excluded.update_time
    `);
    insertStmt.run('sheldon', context.text, now, now);

    console.log("sent hey!");

    // Set aggregation timer
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
