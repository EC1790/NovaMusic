'''app.py provides methods for managing calendar events, including adding,
    retrieving, and deleting events from the database. It interfaces with an
    SQLite backend and is designed to support API operations in a Flask
    web application.
'''
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

'''Routes to all the different pages'''
@app.route('/')
def index():
    return render_template("index.html")

@app.route('/Contact')
def Contact():
    return render_template("Contact.html")

@app.route('/Instruments')
def Instruments():
    return render_template("Instruments.html")

@app.route('/Lessons')
def Lessons():
    return render_template("lessons.html")

@app.route('/ET')
def ET():
    return render_template("ET.html")

@app.route('/EC')
def EC():
    return render_template("EC.html")

@app.route('/KD')
def KD():
    return render_template("KD.html")

@app.route('/JK')
def JK():
    return render_template("JK.html")

@app.route('/FH')
def FH():
    return render_template("FH.html")

@app.route('/VS')
def VS():
    return render_template("VS.html")

@app.route('/AS')
def AS():
    return render_template("AS.html")

@app.route('/RA')
def RA():
    return render_template("RA.html")

@app.route('/JW')
def JW():
    return render_template("JW.html")

@app.route('/MP')
def MP():
    return render_template("MP.html")

@app.route('/SignUp')
def SignUp():
    return render_template("signup.html")

@app.route('/navbar')
def navbar():
    return render_template('navbar.html')
    
'''Gets events from the db'''
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

'''Adds events into the db'''
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

'''Deletes events from the db'''
@app.route('/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    conn = sqlite3.connect("events.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM events WHERE id = ?", (event_id,))
    conn.commit()
    conn.close()
    return '', 200

init_db()  # Always run this when the app starts

if __name__ == '__main__':
    app.run(debug=True)
