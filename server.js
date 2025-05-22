const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("events.db");

db.run(`CREATE TABLE IF NOT EXISTS events (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	date TEXT,
	title TEXT,
	description TEXT
)`);

app.get("/events", (req, res) => {
	db.all("SELECT * FROM events", [], (err, rows) => {
		if (err) return res.status(500).send(err);
		res.json(rows);
	});
});

app.post("/events", (req, res) => {
	const { date, title, description } = req.body;
	db.run(
		"INSERT INTO events (date, title, description) VALUES (?, ?, ?)",
		[date, title, description],
		function (err) {
			if (err) return res.status(500).send(err);
			res.json({ id: this.lastID, date, title, description });
		}
	);
});

app.delete("/events/:id", (req, res) => {
	const id = req.params.id;
	db.run("DELETE FROM events WHERE id = ?", [id], function (err) {
		if (err) return res.status(500).send(err);
		res.sendStatus(200);
	});
});

app.listen(3000, () => {
	console.log("Server running on http://localhost:3000");
});
