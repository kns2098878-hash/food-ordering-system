# Foodie — REST API Documentation

Base URL: `http://127.0.0.1:5000/api/v1` (Fallback: `http://127.0.0.1:5000/api`)

All requests and responses use `Content-Type: application/json`.
Protected endpoints require:
```http
Authorization: Bearer <jwt_token>
```
Or for local development fallback:
```http
X-User-Id: <user_id>
```

---

## 1. Authentication & Profile (`/auth`)

### 1.1 Register Customer
- **Endpoint**: `POST /auth/register`
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!",
    "phone": "+91 9876543210"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGciOi...",
    "user": {
      "id": 5,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "customer"
    }
  }
  ```

### 1.2 Login
- **Endpoint**: `POST /auth/login`
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "message": "Login successful!",
    "token": "eyJhbGciOi...",
    "user": {
      "id": 5,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "customer"
    }
  }
  ```

### 1.3 Current User Profile
- **Endpoint**: `GET /auth/me` (Protected)
- **Response** (200 OK):
  ```json
  {
    "id": 5,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+91 9876543210",
    "role": "customer",
    "addresses": []
  }
  ```

---

## 2. Restaurants & Menus (`/restaurants`)

### 2.1 List Restaurants
- **Endpoint**: `GET /restaurants?search=biryani&is_pure_veg=false&sort=rating`
- **Query Parameters**:
  - `search` (string): Text search across restaurant name, cuisine, and description.
  - `cuisine` (string): Specific cuisine filter.
  - `is_pure_veg` (boolean): `true` to filter strictly vegetarian venues.
  - `sort` (string): Options: `rating`, `delivery_time`, `name`.
- **Response** (200 OK):
  ```json
  [
    {
      "id": 1,
      "name": "The Royal Biryani House",
      "cuisine_type": "Biryani & Mughlai",
      "rating": 5.0,
      "rating_count": 2,
      "delivery_fee": 35.0,
      "estimated_delivery_time": "30-40 mins",
      "image_url": "https://..."
    }
  ]
  ```

### 2.2 Get Restaurant Menu
- **Endpoint**: `GET /restaurants/:id/menu`
- **Response** (200 OK):
  ```json
  {
    "restaurant": {
      "id": 1,
      "name": "The Royal Biryani House"
    },
    "categories": [
      {
        "id": 1,
        "name": "Biryani Specialties",
        "items": [
          {
            "id": 1,
            "name": "Royal Hyderabadi Chicken Dum Biryani",
            "price": 320.0,
            "is_vegetarian": false,
            "is_available": true
          }
        ]
      }
    ]
  }
  ```

---

## 3. Cart Management (`/cart`)

### 3.1 Get Cart
- **Endpoint**: `GET /cart` (Protected)
- **Response** (200 OK):
  ```json
  {
    "items": [
      {
        "id": 10,
        "menu_item_id": 1,
        "name": "Royal Hyderabadi Chicken Dum Biryani",
        "price": 320.0,
        "quantity": 2,
        "subtotal": 640.0
      }
    ],
    "subtotal": 640.0,
    "count": 2
  }
  ```

### 3.2 Add Item to Cart
- **Endpoint**: `POST /cart/items` (Protected)
- **Request Body**:
  ```json
  {
    "menu_item_id": 1,
    "quantity": 1,
    "customization_notes": "Extra raita"
  }
  ```

---

## 4. Orders & Checkout (`/orders`)

### 4.1 Order Preview & Calculation
- **Endpoint**: `POST /orders/calculate`
- **Request Body**:
  ```json
  {
    "items": [{"menu_item_id": 1, "quantity": 2}],
    "restaurant_id": 1,
    "coupon_code": "WELCOME100"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "subtotal": 640.0,
    "delivery_fee": 35.0,
    "tax_amount": 32.0,
    "discount_amount": 100.0,
    "total_amount": 607.0,
    "coupon_valid": true
  }
  ```

### 4.2 Place Order (Atomic Transaction)
- **Endpoint**: `POST /orders` (Protected)
- **Request Body**:
  ```json
  {
    "restaurant_id": 1,
    "delivery_address_text": "Flat 4B, Emerald Residency, Chennai",
    "payment_method": "demo_card",
    "coupon_code": "WELCOME100",
    "customer_notes": "Leave package at reception"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "message": "Order placed successfully!",
    "order": {
      "id": 6,
      "order_number": "ORD-20261021-1006",
      "status": "placed",
      "total_amount": 607.0
    }
  }
  ```

---

## 5. Table Reservations (`/reservations`)

### 5.1 Check Availability
- **Endpoint**: `GET /reservations/availability?restaurant_id=1&date=2026-10-25&party_size=4`
- **Response** (200 OK):
  ```json
  {
    "available_slots": ["12:00", "13:00", "19:00", "20:00", "21:00"],
    "tables_count": 3
  }
  ```

### 5.2 Create Reservation
- **Endpoint**: `POST /reservations` (Protected)
- **Request Body**:
  ```json
  {
    "restaurant_id": 1,
    "reservation_date": "2026-10-25",
    "reservation_time": "19:00",
    "party_size": 4,
    "special_requests": "Window seat preferred"
  }
  ```

---

## 6. Admin Endpoints (`/admin`) — Requires `admin` role

### 6.1 Dashboard Statistics
- **Endpoint**: `GET /admin/dashboard`
- **Response** (200 OK): Returns `summary` (total revenue, orders, reservations), `sales_chart` (daily performance), `recent_orders`, and `popular_items`.

### 6.2 Update Order Status
- **Endpoint**: `PATCH /admin/orders/:id/status`
- **Request Body**:
  ```json
  {
    "status": "confirmed",
    "notes": "Kitchen acknowledged receipt"
  }
  ```
