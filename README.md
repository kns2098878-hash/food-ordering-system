# 🍽️ Foodie – Food Ordering & Restaurant Reservation System

Foodie is a full-stack web-based Food Ordering and Restaurant Reservation System that allows customers to browse restaurants, view menus, add food items to a cart, place orders, reserve tables, and manage their orders and reservations.

The system also provides an Admin Dashboard through which administrators can manage restaurants, menu items, orders, and reservations.

The project is developed using a modern frontend with React.js and a backend using Python Flask, with MySQL used as the relational database.


---

📌 Table of Contents

Project Overview

Objectives

Key Features

User Roles

Technology Stack

System Architecture

Project Structure

Application Workflow

Frontend Features

Backend Features

Database Design

Main Database Entities

API Structure

Installation and Setup

Frontend Setup

Backend Setup

Database Setup

Environment Variables

Running the Project

Customer Workflow

Admin Workflow

Order Workflow

Reservation Workflow

Validation

Error Handling

Testing

Security

Future Enhancements

Team Contributions

Troubleshooting

Conclusion



---

📖 Project Overview

Foodie is designed to provide a simple and convenient platform for restaurant food ordering and table reservations.

Traditional restaurant ordering and reservation systems can involve multiple manual steps. Customers may have to visit restaurants to view menus, make phone calls for reservations, or wait for order processing.

Foodie provides these functionalities through a single web application.

The application consists of three major layers:

1. Frontend

Provides the user interface.

Built using React.js.

Handles navigation, forms, cart operations, and user interactions.



2. Backend

Built using Python Flask.

Provides REST APIs.

Handles authentication, orders, reservations, restaurant data, and admin operations.



3. Database

Uses MySQL.

Stores users, restaurants, menu items, orders, reservations, tables, and related information.





---

🎯 Objectives

The main objectives of Foodie are:

To provide an easy-to-use online food ordering system.

To allow customers to browse restaurants.

To display restaurant menus dynamically.

To allow customers to add food items to a shopping cart.

To calculate order totals automatically.

To allow customers to place food orders.

To provide restaurant table reservation functionality.

To allow customers to view their previous orders.

To allow customers to view their reservations.

To provide authentication through login and registration.

To provide administrators with management functionality.

To maintain all application data using a relational database.

To provide communication between the React frontend and Flask backend through APIs.



---

⭐ Key Features

👤 Customer Features

Registration

New customers can create an account by providing:

Name

Email

Phone number

Password


The registration form performs basic validation before submitting the information to the backend.


---

Login

Registered customers can log in using:

Email

Password


After successful authentication, the customer can access the dashboard and other authenticated features.


---

Browse Restaurants

Customers can view the available restaurants.

Each restaurant can provide:

Restaurant name

Description

Restaurant information

Menu access



---

View Restaurant Menu

Customers can select a restaurant and view its menu.

Each menu item can contain:

Item name

Description

Price

Vegetarian/non-vegetarian information

Availability status



---

Add Items to Cart

Customers can add available menu items to the shopping cart.

The cart supports:

Adding items

Increasing quantity

Decreasing quantity

Removing items

Automatic subtotal calculation



---

Checkout

Customers can proceed to checkout after adding food items to the cart.

The checkout page collects:

Delivery address

Phone number


The total order amount is calculated automatically.


---

Place Order

After entering valid delivery details, customers can place an order.

The order is sent to the backend and stored in the database.


---

Order Confirmation

After a successful order, the customer is shown an order confirmation page.


---

View Orders

Customers can view their previous orders.

Order information may include:

Order ID

Order status

Total amount

Order details



---

Restaurant Reservation

Customers can reserve a table at a restaurant.

The reservation process includes:

1. Selecting a restaurant.


2. Selecting a date.


3. Selecting a time.


4. Entering the number of guests.


5. Checking table availability.


6. Selecting an available table.


7. Confirming the reservation.




---

View Reservations

Customers can view their existing reservations.

Reservation information may include:

Reservation ID

Restaurant

Date

Time

Number of guests

Table

Reservation status



---

👨‍💼 Admin Features

The application includes an Admin Dashboard for managing the system.

Administrators can manage:

Restaurants

Menu items

Orders

Reservations


Depending on the final backend implementation, admin operations can include:

Restaurant Management

Add restaurant

View restaurants

Edit restaurant

Delete restaurant


Menu Management

Add menu item

View menu items

Edit menu item

Delete menu item

Change availability


Order Management

View customer orders

View order details

Update order status


Possible order statuses include:

Pending  
Confirmed  
Preparing  
Out for Delivery  
Delivered  
Cancelled  
Reservation Management  
View reservations  
View reservation details  
Update reservation status  
Cancel reservations  
👥 User Roles  
The system primarily supports two types of users.  
Customer  
Customers can:  
Register  
Login  
Browse restaurants  
View menus  
Add food to cart  
Place orders  
View orders  
Reserve tables  
View reservations  
Administrator  
Administrators can:  
Login  
View dashboard  
Manage restaurants  
Manage menus  
Manage orders  
Manage reservations  
🛠️ Technology Stack  
Frontend  
React.js  
JavaScript  
HTML5  
CSS3  
React Router  
Vite  
Backend  
Python  
Flask  
Flask REST APIs  
Database  
MySQL  
Development Tools  
Visual Studio Code  
Git  
GitHub  
MySQL Workbench  
Postman  
🏗️ System Architecture  
The application follows a three-layer architecture:  
                ┌──────────────────────┐  
                │      CUSTOMER        │  
                │      / ADMIN         │  
                └──────────┬───────────┘  
                           │  
                           ▼  
                ┌──────────────────────┐  
                │   REACT FRONTEND     │  
                │                      │  
                │  Pages               │  
                │  Components          │  
                │  Cart                │  
                │  Forms               │  
                │  Navigation          │  
                └──────────┬───────────┘  
                           │  
                      REST API  
                           │  
                           ▼  
                ┌──────────────────────┐  
                │    FLASK BACKEND     │  
                │                      │  
                │ Authentication       │  
                │ Restaurant APIs       │  
                │ Menu APIs             │  
                │ Order APIs            │  
                │ Reservation APIs      │  
                │ Admin APIs            │  
                └──────────┬───────────┘  
                           │  
                           ▼  
                ┌──────────────────────┐  
                │    MYSQL DATABASE    │  
                │                      │  
                │ Users                │  
                │ Restaurants          │  
                │ Menu Items            │  
                │ Orders               │  
                │ Reservations          │  
                │ Tables               │  
                └──────────────────────┘  
📁 Project Structure  
A possible final project structure is:  
food-ordering-system/  
│  
├── frontend/  
│   │  
│   ├── public/  
│   │  
│   ├── src/  
│   │   │  
│   │   ├── assets/  
│   │   │  
│   │   ├── components/  
│   │   │   ├── Navbar.jsx  
│   │   │   └── StatusMessage.jsx  
│   │   │  
│   │   ├── context/  
│   │   │   └── CartContext.jsx  
│   │   │  
│   │   ├── pages/  
│   │   │   ├── Home.jsx  
│   │   │   ├── Restaurants.jsx  
│   │   │   ├── RestaurantMenu.jsx  
│   │   │   ├── Cart.jsx  
│   │   │   ├── Checkout.jsx  
│   │   │   ├── Login.jsx  
│   │   │   ├── Register.jsx  
│   │   │   ├── Dashboard.jsx  
│   │   │   ├── Orders.jsx  
│   │   │   ├── Reservation.jsx  
│   │   │   ├── Reservations.jsx  
│   │   │   ├── AdminDashboard.jsx  
│   │   │   └── AdminMenu.jsx  
│   │   │  
│   │   ├── services/  
│   │   │   └── api.js  
│   │   │  
│   │   ├── App.jsx  
│   │   ├── App.css  
│   │   ├── index.css  
│   │   └── main.jsx  
│   │  
│   ├── package.json  
│   ├── package-lock.json  
│   └── vite.config.js  
│  
├── backend/  
│   │  
│   ├── app.py  
│   ├── config.py  
│   │  
│   ├── routes/  
│   │   ├── auth.py  
│   │   ├── restaurants.py  
│   │   ├── menu.py  
│   │   ├── orders.py  
│   │   ├── reservations.py  
│   │   └── admin.py  
│   │  
│   ├── requirements.txt  
│   └── ...  
│  
├── database/  
│   └── database.sql  
│  
├── .gitignore  
├── .env.example  
└── README.md  
The exact structure can be adjusted according to the final implementation.  
🔄 Application Workflow  
The general workflow is:  
User  
  │  
  ▼  
Open Foodie  
  │  
  ▼  
Browse Restaurants  
  │  
  ▼  
Select Restaurant  
  │  
  ▼  
View Menu  
  │  
  ▼  
Add Items to Cart  
  │  
  ▼  
Checkout  
  │  
  ▼  
Enter Delivery Details  
  │  
  ▼  
Place Order  
  │  
  ▼  
Flask API  
  │  
  ▼  
MySQL Database  
  │  
  ▼  
Order Confirmation  
For reservations:  
User  
  │  
  ▼  
Select Restaurant  
  │  
  ▼  
Select Date & Time  
  │  
  ▼  
Enter Number of Guests  
  │  
  ▼  
Check Availability  
  │  
  ▼  
Available Tables  
  │  
  ▼  
Select Table  
  │  
  ▼  
Confirm Reservation  
  │  
  ▼  
Flask API  
  │  
  ▼  
MySQL Database  
💻 Frontend Features  
The React frontend contains multiple pages.  
Home  
Provides an introduction to the Foodie system.  
Restaurants  
Displays available restaurants retrieved through the backend API.  
Restaurant Menu  
Displays menu items for a selected restaurant.  
Cart  
Allows customers to manage selected food items.  
Checkout  
Collects delivery details and displays the total order amount.  
Login  
Provides customer authentication.  
Register  
Allows new customers to create accounts.  
Dashboard  
Provides an overview of customer-related functionality.  
Orders  
Displays customer orders.  
Reservation  
Provides the table reservation interface.  
Reservations  
Displays existing reservations.  
Admin Dashboard  
Provides administrative management functionality.  
🐍 Backend Features  
The Flask backend acts as the bridge between the React frontend and MySQL database.  
The backend is responsible for:  
Processing HTTP requests  
Validating input  
Authenticating users  
Executing database queries  
Returning JSON responses  
Creating orders  
Updating order status  
Checking table availability  
Creating reservations  
Managing restaurants  
Managing menu items  
Managing customer data  
Providing admin functionality  
🗄️ Database Design  
MySQL is used as the relational database.  
The database stores information required for:  
User accounts  
Restaurants  
Tables  
Menu categories  
Menu items  
Orders  
Order items  
Reservations  
📊 Main Database Entities  
User  
Stores customer and administrator account information.  
Typical fields:  
user_id  
name  
email  
phone  
password  
role  
created_at  
Restaurant  
Stores restaurant information.  
Typical fields:  
restaurant_id  
restaurant_name  
description  
address  
phone  
Restaurant Table  
Stores tables available for reservations.  
Typical fields:  
table_id  
restaurant_id  
table_number  
capacity  
status  
Menu Category  
Stores categories for menu items.  
Examples:  
Biryani  
South Indian  
Starters  
Main Course  
Desserts  
Beverages  
Menu Item  
Stores food items.  
Typical fields:  
item_id  
restaurant_id  
category_id  
item_name  
description  
price  
is_vegetarian  
is_available  
Order  
Stores customer orders.  
Typical fields:  
order_id  
customer_id  
restaurant_id  
order_date  
total_amount  
status  
delivery_address  
phone  
Order Item  
Stores individual items belonging to an order.  
Typical fields:  
order_item_id  
order_id  
item_id  
quantity  
price  
Reservation  
Stores restaurant table reservations.  
Typical fields:  
reservation_id  
customer_id  
restaurant_id  
table_id  
reservation_date  
reservation_time  
number_of_guests  
status  
🔗 Database Relationships  
The major relationships are:  
User  
 │  
 ├──────────────► Orders  
 │  
 └──────────────► Reservations  
  
  
Restaurant  
 │  
 ├──────────────► Menu Items  
 │  
 ├──────────────► Tables  
 │  
 ├──────────────► Orders  
 │  
 └──────────────► Reservations  
  
  
Order  
 │  
 └──────────────► Order Items  
                    │  
                    └──────► Menu Item  
  
  
Reservation  
 │  
 └──────────────► Restaurant Table  
🌐 API Structure  
The frontend communicates with the Flask backend using REST APIs.  
The exact routes should match the final backend implementation.  
A typical API structure is:  
Authentication  
POST /api/auth/register  
POST /api/auth/login  
POST /api/auth/logout  
Restaurants  
GET    /api/restaurants  
GET    /api/restaurants/<id>  
POST   /api/restaurants  
PUT    /api/restaurants/<id>  
DELETE /api/restaurants/<id>  
Menu  
GET    /api/restaurants/<id>/menu  
POST   /api/menu  
PUT    /api/menu/<id>  
DELETE /api/menu/<id>  
Orders  
GET  /api/orders  
GET  /api/orders/<id>  
POST /api/orders  
PUT  /api/orders/<id>  
Reservations  
GET  /api/reservations  
POST /api/reservations  
GET  /api/reservations/availability  
PUT  /api/reservations/<id>  
DELETE /api/reservations/<id>  
⚙️ Installation and Setup  
Prerequisites  
Before running the project, install:  
Node.js  
Node.js is required for the React frontend.  
Check installation:  
node --version  
and:  
npm --version  
Python  
Python is required for Flask.  
Check installation:  
python --version  
MySQL  
Install MySQL Server and MySQL Workbench.  
Check that the MySQL server is running before starting the backend.  
Git  
Git is recommended for version control.  
Check installation:  
git --version  
📥 Clone the Repository  
Clone the GitHub repository:  
git clone <YOUR_GITHUB_REPOSITORY_URL>  
Move into the project directory:  
cd food-ordering-system  
🎨 Frontend Setup  
Move to the frontend directory:  
cd frontend  
Install dependencies:  
npm install  
Create a .env file:  
VITE_API_URL=http://localhost:5000/api  
Start the development server:  
npm run dev  
The frontend will normally be available at:  
http://localhost:5173  
🐍 Backend Setup  
Open another terminal.  
Move to the backend:  
cd backend  
Create a Python virtual environment:  
python -m venv venv  
Activate it on Windows:  
venv\Scripts\activate  
On macOS/Linux:  
source venv/bin/activate  
Install dependencies:  
pip install -r requirements.txt  
🗄️ Database Setup  
Open MySQL Workbench.  
Create the database:  
CREATE DATABASE foodie;  
Select it:  
USE foodie;  
Run the SQL script provided in:  
database/database.sql  
The SQL script should create the required tables and insert sample data.  
🔐 Environment Variables  
The backend should use environment variables for sensitive information.  
Example:  
DB_HOST=localhost  
DB_USER=root  
DB_PASSWORD=YOUR_PASSWORD  
DB_NAME=foodie  
SECRET_KEY=YOUR_SECRET_KEY  
Do not commit real passwords or secret keys to GitHub.  
Create an example file:  
.env.example  
Example:  
DB_HOST=localhost  
DB_USER=root  
DB_PASSWORD=your_password  
DB_NAME=foodie  
SECRET_KEY=your_secret_key  
▶️ Running the Backend  
After activating the virtual environment:  
python app.py  
Depending on the Flask configuration, the backend will normally run at:  
http://localhost:5000  
▶️ Running the Complete Application  
Two terminals should normally be used.  
Terminal 1 — Backend  
cd backend  
python app.py  
Terminal 2 — Frontend  
cd frontend  
npm run dev  
Then open the frontend URL provided by Vite.  
👤 Customer Workflow  
A normal customer workflow is:  
Step 1  
Open the Foodie website.  
Step 2  
Register an account.  
Step 3  
Login.  
Step 4  
Browse restaurants.  
Step 5  
Select a restaurant.  
Step 6  
View the restaurant menu.  
Step 7  
Add food items to the cart.  
Step 8  
Open the cart.  
Step 9  
Modify quantities if required.  
Step 10  
Proceed to checkout.  
Step 11  
Enter delivery address and phone number.  
Step 12  
Place the order.  
Step 13  
View order confirmation.  
Step 14  
View the order from the Orders page.  
🪑 Reservation Workflow  
Step 1  
Open the Reservation page.  
Step 2  
Select a restaurant.  
Step 3  
Select a date.  
Step 4  
Select a time.  
Step 5  
Enter the number of guests.  
Step 6  
Click:  
Check Availability  
Step 7  
The backend checks available tables.  
Step 8  
Available tables are displayed.  
Step 9  
Select a table.  
Step 10  
Confirm the reservation.  
Step 11  
The reservation is stored in MySQL.  
Step 12  
The customer can view the reservation later.  
👨‍💼 Admin Workflow  
The administrator can access the Admin Dashboard.  
From the dashboard, the administrator can manage:  
Restaurants  
Menu  
Orders  
Reservations  
Typical admin workflow:  
Admin Login  
     ↓  
Admin Dashboard  
     ↓  
Choose Management Section  
     ↓  
View Records  
     ↓  
Add / Edit / Delete / Update  
     ↓  
Backend API  
     ↓  
MySQL Database  
🛒 Order Workflow  
The order system follows:  
Select Restaurant  
       ↓  
Select Menu Item  
       ↓  
Add to Cart  
       ↓  
Set Quantity  
       ↓  
Calculate Total  
       ↓  
Checkout  
       ↓  
Validate Details  
       ↓  
Send Order to Flask  
       ↓  
Store Order in MySQL  
       ↓  
Generate Order Confirmation  
🪑 Reservation Workflow  
The reservation system follows:  
Select Restaurant  
       ↓  
Select Date  
       ↓  
Select Time  
       ↓  
Enter Guests  
       ↓  
Check Table Availability  
       ↓  
Select Available Table  
       ↓  
Create Reservation  
       ↓  
Store Reservation in MySQL  
       ↓  
Display Reservation  
✅ Validation  
The application performs client-side and server-side validation.  
Registration Validation  
Name cannot be empty.  
Email must have a valid format.  
Phone number must be valid.  
Password must satisfy the minimum length requirement.  
Login Validation  
Email cannot be empty.  
Password cannot be empty.  
Checkout Validation  
Delivery address cannot be empty.  
Delivery address should contain sufficient information.  
Phone number should contain exactly 10 digits.  
Reservation Validation  
Restaurant must be selected.  
Date must be selected.  
Time must be selected.  
Number of guests must be valid.  
A table must be available before reservation.  
❌ Error Handling  
The frontend displays appropriate messages when an operation fails.  
Examples:  
Failed to fetch  
Invalid login credentials  
Please fill all required fields  
No restaurants found  
No menu items available  
No orders found  
No reservations found  
The Flask backend should return suitable HTTP status codes and JSON error messages.  
🧪 Testing  
The application should be tested using both frontend and backend testing.  
Frontend Testing  
Test:  
Navigation  
Registration  
Login  
Restaurant browsing  
Menu display  
Add to cart  
Quantity changes  
Remove from cart  
Checkout  
Order confirmed
