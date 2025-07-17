from flask import Flask, request, jsonify, render_template, redirect
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

@app.before_request
def redirect_to_https_and_www():
    forwarded_proto = request.headers.get('X-Forwarded-Proto', 'http')
    host = request.host

    # Check if both HTTPS and www are already correct
    if forwarded_proto == 'https' and host.startswith('www.'):
        return  # No redirect needed

    # Build the new URL with https and www
    url = request.url

    if forwarded_proto != 'https':
        url = url.replace("http://", "https://")

    if not host.startswith("www."):
        url = url.replace("://", "://www.")

    return redirect(url, code=301)


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

# Teacher routing
@app.route('/EC')  # Flute
def EC():
    return render_template("EC.html")

@app.route('/KD')
def KD():
    return render_template("KD.html")

@app.route('/AS')  # Saxophone
def AS():
    return render_template("AS.html")

@app.route('/JK')
def JK():
    return render_template("JK.html")

@app.route('/VS')  # Trombone
def VS():
    return render_template("VS.html")

@app.route('/RA')  # Piano
def RA():
    return render_template("RA.html")

@app.route('/HB')
def HB():
    return render_template("HB.html")

@app.route('/JH')
def JH():
    return render_template("JH.html")

@app.route('/PA')
def PA():
    return render_template("PA.html")

@app.route('/ET')  # Guitar
def ET():
    return render_template("ET.html")

@app.route('/FH')
def FH():
    return render_template("FH.html")

@app.route('/AS1')
def AS1():
    return render_template("AS1.html")

@app.route('/JW')  # Drums
def JW():
    return render_template("JW.html")

@app.route('/YM')
def YM():
    return render_template("YM.html")

@app.route('/IY')  # French horn
def IY():
    return render_template("IY.html")

@app.route('/AB')  # Multi-instrumental
def AB():
    return render_template("AB.html")

@app.route('/JB')
def JB():
    return render_template("JB.html")

@app.route('/HF')
def HF():
    return render_template("HF.html")

@app.route('/SignUp')
def SignUp():
    return render_template("signup.html")

@app.route('/navbar')
def navbar():
    return render_template('navbar.html')

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

init_db()

if __name__ == '__main__':
    app.run(debug=True)
