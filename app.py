from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)


def init_db():
    conn = sqlite3.connect("events.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            title TEXT,
            description TEXT
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/events', methods=['GET'])
def get_events():
    conn = sqlite3.connect("events.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM events")
    rows = cursor.fetchall()
    conn.close()

    events = [
        {"id": row[0], "date": row[1], "title": row[2], "description": row[3]}
        for row in rows
    ]
    return jsonify(events)

@app.route('/events', methods=['POST'])
def add_event():
    data = request.get_json()
    date = data['date']
    title = data['title']
    description = data.get('description', '')

    conn = sqlite3.connect("events.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO events (date, title, description) VALUES (?, ?, ?)",
        (date, title, description)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return jsonify({"id": new_id, "date": date, "title": title, "description": description})

@app.route('/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    conn = sqlite3.connect("events.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM events WHERE id = ?", (event_id,))
    conn.commit()
    conn.close()
    return '', 200

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
