from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)


# =========================================================
# DATABASE
# =========================================================

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="143*riharika",
        database="foodie_db"
    )


# =========================================================
# HOME
# =========================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Foodie Backend is running!"
    })


# =========================================================
# RESTAURANTS
# =========================================================

@app.route("/api/restaurants", methods=["GET"])
def get_restaurants():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM restaurants")
    data = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(data)


@app.route("/api/restaurants/<int:restaurant_id>", methods=["GET"])
def get_restaurant(restaurant_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM restaurants WHERE id = %s",
        (restaurant_id,)
    )

    data = cursor.fetchone()

    cursor.close()
    db.close()

    if not data:
        return jsonify({
            "message": "Restaurant not found"
        }), 404

    return jsonify(data)


# =========================================================
# RESTAURANT MENU
# =========================================================

@app.route("/api/restaurants/<int:restaurant_id>/menu", methods=["GET"])
def get_restaurant_menu(restaurant_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM menu
        WHERE restaurant_id = %s
        """,
        (restaurant_id,)
    )

    data = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(data)


# =========================================================
# REGISTER
# =========================================================

@app.route("/api/auth/register", methods=["POST"])
def register():

    data = request.get_json() or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "message": "All fields are required"
        }), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id
        FROM users
        WHERE email = %s
        """,
        (email,)
    )

    if cursor.fetchone():

        cursor.close()
        db.close()

        return jsonify({
            "message": "Email already registered"
        }), 409

    cursor.execute(
        """
        INSERT INTO users
        (name, email, password)
        VALUES (%s, %s, %s)
        """,
        (name, email, password)
    )

    db.commit()

    user_id = cursor.lastrowid

    cursor.close()
    db.close()

    return jsonify({
        "message": "Registration successful",
        "user": {
            "id": user_id,
            "name": name,
            "email": email
        }
    }), 201


# =========================================================
# LOGIN
# =========================================================

@app.route("/api/auth/login", methods=["POST"])
def login():

    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            id,
            name,
            email,
            role
        FROM users
        WHERE email = %s
        AND password = %s
        """,
        (email, password)
    )

    user = cursor.fetchone()

    cursor.close()
    db.close()

    if not user:
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    return jsonify({
        "message": "Login successful",
        "user": user
    })


# =========================================================
# ORDERS - GET
# =========================================================

@app.route("/api/orders", methods=["GET"])
def get_orders():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM orders
        ORDER BY id DESC
        """
    )

    data = cursor.fetchall()

    for order in data:

        if order.get("order_date"):
            order["order_date"] = str(order["order_date"])

    cursor.close()
    db.close()

    return jsonify(data)


# =========================================================
# ORDERS - CREATE
# =========================================================

@app.route("/api/orders", methods=["POST"])
def create_order():

    data = request.get_json() or {}

    user_id = data.get("user_id")
    total_amount = data.get("total_amount")

    if user_id is None or total_amount is None:
        return jsonify({
            "message": "user_id and total_amount are required"
        }), 400

    status = data.get("status", "Pending")

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO orders
        (
            user_id,
            total_amount,
            status
        )
        VALUES (%s, %s, %s)
        """,
        (
            user_id,
            total_amount,
            status
        )
    )

    db.commit()

    order_id = cursor.lastrowid

    cursor.close()
    db.close()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": order_id
    }), 201


# =========================================================
# RESERVATION AVAILABILITY
# =========================================================

@app.route("/api/reservations/availability", methods=["GET"])
def reservation_availability():

    restaurant_id = request.args.get("restaurant_id")
    reservation_date = request.args.get("date")
    reservation_time = request.args.get("time")
    guests = request.args.get("guests")

    if not restaurant_id or not reservation_date or not reservation_time:
        return jsonify({
            "message": "restaurant_id, date and time are required"
        }), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT table_number
        FROM reservations
        WHERE restaurant_id = %s
        AND reservation_date = %s
        AND reservation_time = %s
        AND status = 'Confirmed'
        """,
        (
            restaurant_id,
            reservation_date,
            reservation_time
        )
    )

    booked = cursor.fetchall()

    booked_tables = []

    for row in booked:

        if row.get("table_number") is not None:
            booked_tables.append(
                int(row["table_number"])
            )

    cursor.close()
    db.close()

    # Restaurant has 20 tables
    available_tables = []

    for table_number in range(1, 21):

        if table_number not in booked_tables:

            available_tables.append({
                "table_id": table_number,
                "table_number": table_number,
                "capacity": 4
            })

    return jsonify({
        "available": len(available_tables) > 0,
        "tables": available_tables
    })


# =========================================================
# CREATE RESERVATION
# =========================================================

@app.route("/api/reservations", methods=["POST"])
def create_reservation():

    data = request.get_json() or {}

    user_id = data.get("user_id")
    restaurant_id = data.get("restaurant_id")

    reservation_date = data.get("reservation_date")
    reservation_time = data.get("reservation_time")

    guests = data.get("guests")

    # Accept both names
    table_number = data.get("table_number")

    if table_number is None:
        table_number = data.get("table_id")

    # Accept alternate frontend name
    if guests is None:
        guests = data.get("number_of_guests")

    if not user_id:
        return jsonify({
            "message": "Please login again."
        }), 401

    if not restaurant_id:
        return jsonify({
            "message": "Restaurant is required."
        }), 400

    if not reservation_date:
        return jsonify({
            "message": "Reservation date is required."
        }), 400

    if not reservation_time:
        return jsonify({
            "message": "Reservation time is required."
        }), 400

    if not guests:
        return jsonify({
            "message": "Number of guests is required."
        }), 400

    if table_number is None:
        return jsonify({
            "message": "Please select a table."
        }), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Check whether table is already booked
    cursor.execute(
        """
        SELECT id
        FROM reservations
        WHERE restaurant_id = %s
        AND reservation_date = %s
        AND reservation_time = %s
        AND table_number = %s
        AND status = 'Confirmed'
        """,
        (
            restaurant_id,
            reservation_date,
            reservation_time,
            table_number
        )
    )

    existing = cursor.fetchone()

    if existing:

        cursor.close()
        db.close()

        return jsonify({
            "message": "This table is already reserved."
        }), 409

    cursor.execute(
        """
        INSERT INTO reservations
        (
            user_id,
            restaurant_id,
            reservation_date,
            reservation_time,
            guests,
            table_number,
            status
        )
        VALUES
        (
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            'Confirmed'
        )
        """,
        (
            user_id,
            restaurant_id,
            reservation_date,
            reservation_time,
            guests,
            table_number
        )
    )

    db.commit()

    reservation_id = cursor.lastrowid

    cursor.close()
    db.close()

    return jsonify({
        "message": "Reservation created successfully",
        "reservation_id": reservation_id
    }), 201


# =========================================================
# GET RESERVATIONS
# =========================================================

@app.route("/api/reservations", methods=["GET"])
def get_reservations():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            id,
            user_id,
            restaurant_id,
            reservation_date,
            reservation_time,
            guests,
            table_number,
            status
        FROM reservations
        ORDER BY id DESC
        """
    )

    data = cursor.fetchall()

    # Convert MySQL date/time objects
    # into JSON-safe strings
    for reservation in data:

        if reservation.get("reservation_date"):
            reservation["reservation_date"] = str(
                reservation["reservation_date"]
            )

        if reservation.get("reservation_time"):
            reservation["reservation_time"] = str(
                reservation["reservation_time"]
            )

    cursor.close()
    db.close()

    return jsonify(data)


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )