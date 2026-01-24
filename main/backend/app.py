from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os


app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), "SwiftPOS.db")  

def getDatabaseConnection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.post('/api/login')
def login():
    data = request.get_json(silent = True) or {}
    username = data.get('username', "").strip()
    password = data.get('password', "")

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password are required."}), 400

    try:
        conn = getDatabaseConnection()

        user = conn.execute(
            "SELECT UID, username, password FROM users WHERE username = ?",
            (username,)
        ).fetchone()
    finally:
        conn.close()

    if user is None:
        return jsonify({"success": False, "message": "Invalid username or password."}), 401
    
    if user["password"] != password:
        return jsonify({"success": False, "message": "Invalid username or password."}), 401
    
    return jsonify({"success": True, "message": "Login successful."}), 200

if __name__ == '__main__':
    app.run(host = "127.0.0.1", port = 5000, debug = True)