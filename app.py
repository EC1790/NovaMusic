from flask import Flask, request, jsonify, render_template
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

@app.route('/')
def index():
    return render_template("index.html");

@app.route('/Contact')
def Contact():
    return render_template("Contact.html");

@app.route('/Instruments')
def Instruments():
    return render_template("Instruments.html");

@app.route('/Lessons')
def Lessons():
    return render_template("lessons.html");

@app.route('/ET')
def ET():
    return render_template("ET.html");

@app.route('/EC')
def EC():
    return render_template("EC.html");

@app.route('/KD')
def KD():
    return render_template("KD.html");

@app.route('/TC')
def TC():
    return render_template("TC.html");

@app.route('/SignUp')
def SignUp():
    return render_template("signup.html");
# @app.route('/navbar')
# def navbar():
#     return render_template("navbar.html");
    

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
