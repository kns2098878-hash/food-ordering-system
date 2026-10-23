# 🍽️ Project2 — Foodie Advanced Food Ordering & Restaurant Reservation System

[![View on GitHub](https://img.shields.io/badge/GitHub-View%20Project2%20on%20GitHub-181717?style=for-the-badge&logo=github)](https://github.com/kns2098878-hash/food-ordering-system/tree/main/Project2)

> 🔗 **Direct GitHub Link:** [https://github.com/kns2098878-hash/food-ordering-system/tree/main/Project2](https://github.com/kns2098878-hash/food-ordering-system/tree/main/Project2)

> Complete production-style full-stack academic project with normalized 22-table database schema + advanced upgrade, Flask REST API with Blueprints, React 19 + Vite frontend, JWT auth, digital wallet, loyalty tier engine, live order tracking, and pytest test suite.

---

## 📌 Project Overview

**Project2** is an advanced, standalone full-stack food delivery and restaurant reservation platform located inside the `Project2/` directory.

### Key Capabilities
- **Frontend**: React 19 + Vite, React Router v7, Lucide React icons, comprehensive CSS design system, 15 complete pages.
- **Backend**: Python Flask with Application Factory (`create_app`), 10 Blueprint route modules (`/api/v1` and `/api` fallback), SQLAlchemy ORM.
- **Database**: MySQL 8.0+ relational schema (`foodie_db`) with 22 tables, 3 triggers, 3 views, 2 stored procedures, and an advanced upgrade for digital wallet & loyalty rewards.
- **Testing**: 15 passing pytest test cases running against SQLite in-memory fixtures.
- **Advanced Features**: Digital wallet with instant simulation & 1-click checkout, 4-tier loyalty program with multipliers, live order GPS tracker simulation, and dietary/allergen tagging.

---

## 📁 Project Structure

```
Project2/
├── backend/
│   ├── app/
│   │   ├── __init__.py           # Flask app factory, CORS, error handlers
│   │   ├── config.py             # Config & TestConfig
│   │   ├── models/               # 11 ORM model modules
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── user.py
│   │   │   ├── restaurant.py
│   │   │   ├── menu.py
│   │   │   ├── order.py
│   │   │   ├── reservation.py
│   │   │   ├── coupon.py
│   │   │   ├── review.py
│   │   │   ├── payment.py
│   │   │   ├── audit.py
│   │   │   └── wallet.py
│   │   ├── routes/               # 10 Blueprint routes
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── restaurants.py
│   │   │   ├── cart.py
│   │   │   ├── orders.py
│   │   │   ├── reservations.py
│   │   │   ├── reviews.py
│   │   │   ├── coupons.py
│   │   │   ├── addresses.py
│   │   │   ├── admin.py
│   │   │   └── wallet.py
│   │   ├── services/
│   │   │   ├── checkout_service.py    # Atomic checkout, wallet debit, price verification
│   │   │   └── reservation_service.py # Conflict-safe table reservation
│   │   └── utils/
│   │       └── security.py       # JWT token generation, role verification
│   ├── tests/                    # 15 pytest unit & integration tests
│   │   ├── conftest.py
│   │   ├── test_admin.py
│   │   ├── test_auth.py
│   │   ├── test_checkout.py
│   │   └── test_reservations.py
│   ├── app.py                    # Flask development server runner
│   ├── requirements.txt          # Python dependencies
│   └── .env.example              # Environment variables template
├── database/
│   ├── schema.sql                # 22-table base schema, views, triggers, stored procedures
│   ├── seed.sql                  # Realistic demo records
│   ├── advanced_queries.sql      # 10 advanced SQL queries (CTEs, Window functions, EXPLAIN)
│   └── advanced_database_upgrade.sql # Wallet, loyalty tiers, dietary tags, customer 360 view
├── docs/
│   ├── architecture.md           # Architecture, system components, security model
│   ├── database-design.md        # 3NF normalization, table catalog, triggers, views
│   └── api-documentation.md      # Full REST API documentation with sample payloads
├── public/                       # Static assets & icons
├── src/
│   ├── components/               # Navbar, Footer, FoodCard, FoodModal, RestaurantCard, Route Guards
│   ├── context/                  # AuthContext, CartContext
│   ├── pages/                    # 15 Page components (Home, Restaurants, Menu, Cart, Checkout,
│   │                             # Orders, Reservation, Login, Register, Profile, Wallet,
│   │                             # Dashboard, AdminDashboard, AdminOrders/Menu/Restaurants, 404)
│   ├── services/
│   │   └── api.js                # Frontend API client
│   ├── App.jsx                   # Central route configuration
│   ├── index.css                 # Global CSS design tokens
│   └── main.jsx                  # React DOM mount point
├── index.html                    # HTML entry point
├── package.json                  # Node dependencies
├── vite.config.js                # Vite build & proxy configuration
└── README.md                     # Documentation
```

---

## 🚀 How to Run Project2

### 1. Database Setup (MySQL)
Open MySQL command line or Workbench:
```sql
CREATE DATABASE IF NOT EXISTS foodie_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE foodie_db;
```
Import the database scripts in order:
```powershell
mysql -u root -p foodie_db < Project2\database\schema.sql
mysql -u root -p foodie_db < Project2\database\seed.sql
mysql -u root -p foodie_db < Project2\database\advanced_database_upgrade.sql
```

### 2. Backend Setup (Flask API)
```powershell
cd Project2\backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template
copy .env.example .env
# Update .env with your MySQL root password

# Run tests
pytest tests/ -v

# Start the Flask server
python app.py
```
*Backend runs at `http://127.0.0.1:5000`.*

### 3. Frontend Setup (React + Vite)
In a second terminal:
```powershell
cd Project2

# Install dependencies
npm install

# Start development server
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Features / Access |
|---|---|---|---|
| **Customer (Silver Tier)** | `riharika@gmail.com` | `123456` | Has active orders to track, ₹750 wallet balance, reservations |
| **Customer (Bronze Tier)** | `sriram@gmail.com` | `sriram123` | Past reservations, saved addresses |
| **Admin** | `admin@foodie.com` | `admin123` | Full Admin Dashboard, status controls, restaurant & menu CRUD |
| **Restaurant Owner** | `owner@biryaniking.com` | `owner123` | Royal Biryani House management |

---

## 🧪 Test Verification
Run the 15-test automated test suite:
```powershell
cd Project2\backend
pytest tests/ -v
```
Output: `15 passed in ~6.5s`.
