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
    
    return jsonify({"success": True, "message": "Login successful.", "UID": user["UID"], "Username": user["username"]}), 200

@app.post('/api/signup')
def signup():
    data = request.get_json(silent = True) or {}
    first_name = data.get('firstname', "").strip()
    last_name = data.get('lastname', "").strip()
    email = data.get('email', "").strip()
    username = data.get('username', "").strip()
    password = data.get('password', "")

    if not all([first_name, last_name, email, username, password]):
        return jsonify({"success": False, "message": "All fields are required."}), 400

    try:
        conn = getDatabaseConnection()

        existing_user = conn.execute(
            "SELECT UID FROM users WHERE username = ?",
            (username,)
        ).fetchone()

        if existing_user is not None:
            return jsonify({"success": False, "message": "Username already exists."}), 409

        conn.execute(
            """
            INSERT INTO users ("First Name", "Last Name", "Username", "Email", "Password")
            VALUES (?, ?, ?, ?, ?)
            """,
            (first_name, last_name, username, email, password)
        )

        conn.commit()
    finally:
        conn.close()

    return jsonify({"success": True, "message": "Signup successful."}), 201

@app.get('/api/products')
def get_products():
    uid = request.args.get('uid', type=int)
    
    if not uid:
        return jsonify({"success": False, "message": "UID is required."}), 400
    
    try:
        conn = getDatabaseConnection()
        products = conn.execute(
            "SELECT Name FROM Products WHERE OwnerUID = ? AND IsActive = 1",
            (uid,)
        ).fetchall()
        product_list = [dict(product) for product in products]
    finally:
        conn.close()
    return jsonify({"success": True, "products": product_list}), 200


@app.get('/api/product')
def get_product_by_name():
    uid = request.args.get('uid', type=int)
    product_name = request.args.get('name', '').strip()
    
    if not uid:
        return jsonify({"success": False, "message": "UID is required."}), 400
    
    if not product_name:
        return jsonify({"success": False, "message": "Product name is required."}), 400
    
    try:
        conn = getDatabaseConnection()
        product = conn.execute(
            "SELECT Name, Description, PriceCents FROM Products WHERE OwnerUID = ? AND Name = ? AND IsActive = 1",
            (uid, product_name)
        ).fetchone()
        
        if product is None:
            return jsonify({"success": False, "message": "Product not found."}), 404
        
        product_data = {
            "Name": product["Name"],
            "Description": product["Description"],
            "Price": f"{product['PriceCents'] / 100:.2f}"  # Format as "13.13"
        }
    finally:
        conn.close()

    return jsonify({"success": True, "product": product_data}), 200
@app.post('/api/addproduct')
def add_product():
    data = request.get_json(silent=True) or {}
    uid = data.get('uid')
    name = data.get('name', '').strip()
    description = data.get('description', '').strip()
    price = data.get('price', 0)
    quantity = data.get('quantity', 0)
    if uid:
        uid = int(uid)
    if not uid:
        return jsonify({"success": False, "message": "UID is required."}), 400
    
    if not name:
        return jsonify({"success": False, "message": "Product name is required."}), 400
    
    try:
        # Convert price from dollars to cents
        price_cents = int(float(price) * 100)
        
        conn = getDatabaseConnection()
        
        # Check if product already exists for this user
        existing_product = conn.execute(
            "SELECT PID FROM Products WHERE OwnerUID = ? AND Name = ?",
            (uid, name)
        ).fetchone()
        
        if existing_product:
            return jsonify({"success": False, "message": "Product with this name already exists."}), 409
        
        conn.execute(
            """
            INSERT INTO Products (OwnerUID, Name, Description, PriceCents, Quantity, IsActive)
            VALUES (?, ?, ?, ?, ?, 1)
            """,
            (uid, name, description, price_cents, quantity)
        )
        
        conn.commit()
    finally:
        conn.close()

    return jsonify({"success": True, "message": "Product added successfully."}), 201

@app.delete('/api/deleteproduct')
def delete_product():
    uid = request.args.get('uid', type=int)
    product_name = request.args.get('name', '').strip()
    
    if not uid:
        return jsonify({"success": False, "message": "UID is required."}), 400
    
    if not product_name:
        return jsonify({"success": False, "message": "Product name is required."}), 400
    
    try:
        conn = getDatabaseConnection()
        
        # Check if product exists
        product = conn.execute(
            "SELECT PID FROM Products WHERE OwnerUID = ? AND Name = ? AND IsActive = 1",
            (uid, product_name)
        ).fetchone()
        
        if product is None:
            return jsonify({"success": False, "message": "Product not found."}), 404
        
        # Hard delete - permanently remove from database
        conn.execute(
            "DELETE FROM Products WHERE OwnerUID = ? AND Name = ?",
            (uid, product_name)
        )
        
        conn.commit()
    finally:
        conn.close()

    return jsonify({"success": True, "message": "Product deleted successfully."}), 200

@app.get('/api/suggest')
def suggest_products():

    uid = request.args.get('uid', type=int)
    query = request.args.get('q', '').strip().lower()

    if not uid:
        return jsonify({"success": False, "message": "UID is required."}), 400

    if len(query) < 2:
        return jsonify({"success": True, "products": []}), 200

    try:
        conn = getDatabaseConnection()

        rows = conn.execute(
            """
            SELECT *
            FROM Products
            WHERE OwnerUID = ?
            AND IsActive = 1
            AND lower(Name) LIKE ?
            ORDER BY Name ASC
            LIMIT 8
            """,
            (uid, query + "%")
        ).fetchall()

        products = [dict(row) for row in rows]

    finally:
        conn.close()

    return jsonify({
        "success": True,
        "products": products
    }), 200

@app.post('/api/customers/add')
def add_customer():

    data = request.get_json(silent=True) or {}

    OwnerUID = data.get("OwnerUID")

    # Only require what DB needs
    if not OwnerUID:
        return jsonify({
            "success": False,
            "message": "OwnerUID is required"
        }), 400

    first_name = data.get("first_name")
    last_name = data.get("last_name")
    display_name = data.get("display_name")
    phone = data.get("phone")
    email = data.get("email")

    address_line1 = data.get("address_line1")
    address_line2 = data.get("address_line2")
    city = data.get("city")
    province_state = data.get("province_state")
    postal_code = data.get("postal_code")
    country = data.get("country")

    try:
        conn = getDatabaseConnection()

        cursor = conn.execute("""
            INSERT INTO customers (
                OwnerUID,
                first_name,
                last_name,
                display_name,
                phone,
                email,
                address_line1,
                address_line2,
                city,
                province_state,
                postal_code,
                country
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            OwnerUID,
            first_name,
            last_name,
            display_name,
            phone,
            email,
            address_line1,
            address_line2,
            city,
            province_state,
            postal_code,
            country
        ))

        conn.commit()

        return jsonify({
            "success": True,
            "customer_id": cursor.lastrowid
        })

    finally:
        conn.close()
# ...existing code...

@app.get('/api/customers/getcustomers')
def get_customers():
    uid = request.args.get('uid', type=int)
    
    if not uid:
        return jsonify({"success": False, "message": "User ID required"}), 400
    
    try:
        conn = getDatabaseConnection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT customer_id, first_name, last_name, display_name, phone, email, 
                   address_line1, address_line2, city, province_state, 
                   postal_code, country, created_at
            FROM customers 
            WHERE OwnerUID = ?
            ORDER BY created_at DESC
        """, (uid,))
        
        customers = [dict(row) for row in cursor.fetchall()]
        
        return jsonify({"success": True, "customers": customers}), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@app.get('/api/customers/suggest')
def suggest_customers():
    uid = request.args.get('uid', type=int)
    q_raw = (request.args.get('q', '') or '').strip()

    if not uid:
        return jsonify({"success": False, "message": "UID is required."}), 400

    # keep consistent with your products suggest
    if len(q_raw) < 2:
        return jsonify({"success": True, "customers": []}), 200

    # case-insensitive search text
    q = q_raw.lower()

    # phone-friendly query: remove spaces/dashes/brackets from input
    q_phone = ''.join(ch for ch in q_raw if ch.isdigit())

    try:
        conn = getDatabaseConnection()

        rows = conn.execute(
            """
            SELECT
                customer_id,
                first_name,
                last_name,
                display_name,
                phone,
                email,
                address_line1,
                address_line2,
                city,
                province_state,
                postal_code,
                country,
                created_at
            FROM customers
            WHERE OwnerUID = ?
              AND is_active = 1
              AND (
                lower(COALESCE(first_name,''))   LIKE ?
                OR lower(COALESCE(last_name,'')) LIKE ?
                OR lower(COALESCE(display_name,'')) LIKE ?
                OR lower(COALESCE(email,''))     LIKE ?
                OR lower(COALESCE(city,''))      LIKE ?
                OR lower(COALESCE(province_state,'')) LIKE ?
                OR replace(replace(replace(replace(COALESCE(phone,''), ' ', ''), '-', ''), '(', ''), ')', '') LIKE ?
              )
            ORDER BY
              CASE
                WHEN lower(COALESCE(display_name,'')) LIKE ? THEN 0
                WHEN lower(COALESCE(last_name,'')) LIKE ? THEN 1
                WHEN lower(COALESCE(first_name,'')) LIKE ? THEN 2
                ELSE 3
              END,
              last_name ASC,
              first_name ASC
            LIMIT 8
            """,
            (
                uid,
                f"%{q}%",  # first_name
                f"%{q}%",  # last_name
                f"%{q}%",  # display_name
                f"%{q}%",  # email
                f"%{q}%",  # city
                f"%{q}%",  # province/state
                f"%{q_phone}%" if q_phone else f"%{q}%",  # phone
                f"{q}%",   # ranking: display_name startswith
                f"{q}%",   # ranking: last_name startswith
                f"{q}%",   # ranking: first_name startswith
            )
        ).fetchall()

        customers = [dict(r) for r in rows]

        return jsonify({
            "success": True,
            "customers": customers
        }), 200

    finally:
        conn.close()



if __name__ == '__main__':
    app.run(host = "127.0.0.1", port = 5000, debug = True)