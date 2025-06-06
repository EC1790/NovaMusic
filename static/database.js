const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('events.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      date TEXT
    )
  `);
});

module.exports = db;
