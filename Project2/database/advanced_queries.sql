-- ============================================================================
-- FOODIE ADVANCED FOOD ORDERING & RESTAURANT RESERVATION SYSTEM
-- Advanced SQL Demonstration Script (MySQL 8.0+)
-- Schema: foodie_db (22 Normalized Tables)
-- ============================================================================

USE `foodie_db`;

-- ============================================================================
-- SECTION A: COMPLEX JOINS
-- ============================================================================

-- A1. Multi-Table Inner Join: Complete Order Detail with Customer & Restaurant
-- Purpose: Retrieves completed orders along with customer contact, restaurant metadata,
-- and aggregate item counts.
SELECT 
    o.order_number,
    u.name AS customer_name,
    u.phone AS customer_phone,
    r.name AS restaurant_name,
    r.cuisine_type,
    o.status AS order_status,
    o.subtotal,
    o.tax_amount,
    o.delivery_fee,
    o.discount_amount,
    o.total_amount,
    o.payment_method,
    o.created_at AS order_time,
    COUNT(oi.id) AS item_count
FROM `orders` o
INNER JOIN `users` u ON o.user_id = u.id
INNER JOIN `restaurants` r ON o.restaurant_id = r.id
INNER JOIN `order_items` oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, u.name, u.phone, r.name, r.cuisine_type, 
         o.status, o.subtotal, o.tax_amount, o.delivery_fee, o.discount_amount, 
         o.total_amount, o.payment_method, o.created_at
ORDER BY o.created_at DESC;

-- A2. Left Outer Join: Restaurants and their active discount coupons
-- Purpose: Identifies all restaurants with their reservation table counts, including
-- those with zero active reservations.
SELECT 
    r.name AS restaurant_name,
    r.city,
    r.rating,
    COUNT(DISTINCT rt.id) AS total_tables,
    COUNT(DISTINCT res.id) AS total_reservations_booked
FROM `restaurants` r
LEFT JOIN `restaurant_tables` rt ON r.id = rt.restaurant_id AND rt.is_active = TRUE
LEFT JOIN `reservations` res ON r.id = res.restaurant_id AND res.status IN ('confirmed', 'completed')
GROUP BY r.id, r.name, r.city, r.rating
ORDER BY total_reservations_booked DESC;


-- ============================================================================
-- SECTION B: AGGREGATION WITH GROUP BY & HAVING
-- ============================================================================

-- B1. High-Performing Restaurants: Revenue > ₹200 with Average Order Value
SELECT 
    r.id AS restaurant_id,
    r.name AS restaurant_name,
    COUNT(o.id) AS completed_orders,
    ROUND(SUM(o.total_amount), 2) AS gross_revenue,
    ROUND(AVG(o.total_amount), 2) AS average_order_value,
    ROUND(MAX(o.total_amount), 2) AS largest_single_order
FROM `restaurants` r
INNER JOIN `orders` o ON r.id = o.restaurant_id
WHERE o.status != 'cancelled'
GROUP BY r.id, r.name
HAVING gross_revenue > 200.00
ORDER BY gross_revenue DESC;

-- B2. Most Popular Menu Dishes: Sold at least 1 unit with total sales volume
SELECT 
    mi.id AS item_id,
    mi.name AS item_name,
    r.name AS restaurant_name,
    c.name AS category_name,
    SUM(oi.quantity) AS total_units_sold,
    ROUND(SUM(oi.subtotal), 2) AS total_generated_revenue
FROM `order_items` oi
INNER JOIN `menu_items` mi ON oi.menu_item_id = mi.id
INNER JOIN `restaurants` r ON mi.restaurant_id = r.id
INNER JOIN `menu_categories` c ON mi.category_id = c.id
GROUP BY mi.id, mi.name, r.name, c.name
HAVING total_units_sold >= 1
ORDER BY total_units_sold DESC, total_generated_revenue DESC;


-- ============================================================================
-- SECTION C: SUBQUERIES (Scalar, Correlated & Set Operations)
-- ============================================================================

-- C1. Uncorrelated Scalar Subquery: Menu Items priced above overall catalog average
SELECT 
    m.name AS item_name,
    m.price,
    r.name AS restaurant_name,
    ROUND((SELECT AVG(price) FROM `menu_items`), 2) AS catalog_average_price,
    ROUND(m.price - (SELECT AVG(price) FROM `menu_items`), 2) AS price_differential
FROM `menu_items` m
INNER JOIN `restaurants` r ON m.restaurant_id = r.id
WHERE m.price > (SELECT AVG(price) FROM `menu_items`)
ORDER BY m.price DESC;

-- C2. Correlated Subquery: Menu Items priced above THEIR OWN category average
SELECT 
    m.name AS premium_item,
    m.price AS item_price,
    c.name AS category_name,
    (SELECT ROUND(AVG(m2.price), 2) 
     FROM `menu_items` m2 
     WHERE m2.category_id = m.category_id) AS category_avg_price
FROM `menu_items` m
INNER JOIN `menu_categories` c ON m.category_id = c.id
WHERE m.price > (
    SELECT AVG(m2.price) 
    FROM `menu_items` m2 
    WHERE m2.category_id = m.category_id
)
ORDER BY c.name, m.price DESC;

-- C3. Correlated EXISTS Subquery: Customers who have BOTH placed orders AND reserved tables
SELECT 
    u.id,
    u.name,
    u.email,
    u.phone
FROM `users` u
WHERE EXISTS (
    SELECT 1 FROM `orders` o WHERE o.user_id = u.id AND o.status != 'cancelled'
)
AND EXISTS (
    SELECT 1 FROM `reservations` res WHERE res.user_id = u.id
);


-- ============================================================================
-- SECTION D: COMMON TABLE EXPRESSIONS (CTEs)
-- ============================================================================

-- D1. Customer Spending Segmentation & Order Frequency CTE
WITH CustomerSpend AS (
    SELECT 
        u.id AS customer_id,
        u.name AS customer_name,
        u.email,
        COUNT(o.id) AS total_orders_placed,
        COALESCE(SUM(o.total_amount), 0.00) AS lifetime_expenditure,
        COALESCE(AVG(o.total_amount), 0.00) AS avg_basket_size
    FROM `users` u
    LEFT JOIN `orders` o ON u.id = o.user_id AND o.status != 'cancelled'
    WHERE u.role = 'customer'
    GROUP BY u.id, u.name, u.email
)
SELECT 
    customer_id,
    customer_name,
    email,
    total_orders_placed,
    lifetime_expenditure,
    ROUND(avg_basket_size, 2) AS avg_basket_size,
    CASE 
        WHEN lifetime_expenditure >= 800.00 THEN 'Platinum VIP'
        WHEN lifetime_expenditure >= 400.00 THEN 'Gold Preferred'
        WHEN lifetime_expenditure > 0.00 THEN 'Silver Active'
        ELSE 'Prospect (No Orders)'
    END AS customer_tier
FROM CustomerSpend
ORDER BY lifetime_expenditure DESC;

-- D2. Recursive Date Generator & Daily Sales CTE
WITH RECURSIVE DateRange AS (
    SELECT CAST('2026-09-10' AS DATE) AS sales_date
    UNION ALL
    SELECT sales_date + INTERVAL 1 DAY 
    FROM DateRange 
    WHERE sales_date < '2026-09-20'
),
DailySales AS (
    SELECT 
        DATE(created_at) AS order_day,
        COUNT(id) AS daily_orders,
        SUM(total_amount) AS daily_revenue
    FROM `orders`
    WHERE status != 'cancelled'
    GROUP BY DATE(created_at)
)
SELECT 
    dr.sales_date,
    COALESCE(ds.daily_orders, 0) AS orders_count,
    COALESCE(ds.daily_revenue, 0.00) AS total_revenue
FROM DateRange dr
LEFT JOIN DailySales ds ON dr.sales_date = ds.order_day
ORDER BY dr.sales_date ASC;


-- ============================================================================
-- SECTION E: WINDOW FUNCTIONS
-- ============================================================================

-- E1. DENSE_RANK() & RANK(): Ranking Menu Dishes within their Restaurant
SELECT 
    r.name AS restaurant_name,
    m.name AS dish_name,
    m.price,
    RANK() OVER (PARTITION BY m.restaurant_id ORDER BY m.price DESC) AS price_rank,
    DENSE_RANK() OVER (PARTITION BY m.restaurant_id ORDER BY m.price DESC) AS price_dense_rank
FROM `menu_items` m
INNER JOIN `restaurants` r ON m.restaurant_id = r.id
ORDER BY r.name, price_rank ASC;

-- E2. Cumulative Running Revenue: SUM() OVER (ORDER BY created_at)
SELECT 
    o.id AS order_id,
    o.order_number,
    o.created_at,
    o.total_amount,
    SUM(o.total_amount) OVER (
        ORDER BY o.created_at 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total_revenue,
    AVG(o.total_amount) OVER (
        ORDER BY o.created_at 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_last_3_orders
FROM `orders` o
WHERE o.status != 'cancelled'
ORDER BY o.created_at ASC;


-- ============================================================================
-- SECTION F: VIEWS IN ACTION
-- ============================================================================

-- F1. Querying Pre-computed Restaurant Menu View
SELECT 
    restaurant_name,
    category_name,
    item_name,
    price,
    effective_price,
    is_vegetarian,
    is_popular
FROM `v_restaurant_menu`
WHERE restaurant_city = 'Chennai' AND is_available = TRUE
ORDER BY restaurant_name, category_name;

-- F2. Querying Consolidated Restaurant Performance View
SELECT 
    restaurant_name,
    cuisine_type,
    rating,
    total_orders,
    total_revenue,
    total_reservations
FROM `v_restaurant_performance`
ORDER BY total_revenue DESC;


-- ============================================================================
-- SECTION G: STORED PROCEDURES EXECUTION
-- ============================================================================

-- G1. Execute sp_generate_sales_report for September 2026
CALL `sp_generate_sales_report`('2026-09-01', '2026-09-30', NULL);

-- G2. Execute sp_create_order_atomic
SET @new_order_id = 0;
SET @new_order_no = '';

CALL `sp_create_order_atomic`(
    3, -- User: Riharika Rao
    5, -- Restaurant: Green Harvest Kitchen
    1, -- Address: Home
    'Flat 4B, Emerald Residency, 12 Burkit Road, T. Nagar, Chennai - 600017',
    '+91 9884019283',
    260.00, -- Subtotal
    13.00,  -- Tax (5%)
    20.00,  -- Delivery Fee
    50.00,  -- Discount
    243.00, -- Total
    'FOODIE50',
    'demo_upi',
    @new_order_id,
    @new_order_no
);

SELECT @new_order_id AS created_order_id, @new_order_no AS generated_order_number;


-- ============================================================================
-- SECTION H: TRIGGERS VALIDATION
-- ============================================================================

-- H1. Test Order Status History Trigger
-- Updating status should automatically fire trg_after_order_status_update
UPDATE `orders` 
SET `status` = 'delivered' 
WHERE `id` = @new_order_id;

-- Verify trigger record inserted in order_status_history
SELECT * FROM `order_status_history` WHERE `order_id` = @new_order_id;


-- ============================================================================
-- SECTION I: TRANSACTION INTEGRITY & CONCURRENCY
-- ============================================================================

-- I1. ACID Transaction: Atomic Coupon Redemption & Usage Counter
START TRANSACTION;

-- Check coupon validity with row-level lock
SELECT id, code, times_used, usage_limit 
FROM `coupons` 
WHERE `code` = 'FOODIE50' AND is_active = TRUE AND valid_to >= NOW()
FOR UPDATE;

-- Increment usage count
UPDATE `coupons` 
SET `times_used` = `times_used` + 1 
WHERE `code` = 'FOODIE50';

-- Insert redemption record
INSERT INTO `coupon_redemptions` (`coupon_id`, `user_id`, `order_id`, `discount_applied`, `redeemed_at`)
VALUES (1, 3, @new_order_id, 50.00, NOW());

-- Commit transaction safely
COMMIT;

-- Verify atomic results
SELECT code, times_used FROM `coupons` WHERE code = 'FOODIE50';


-- ============================================================================
-- SECTION J: QUERY PERFORMANCE & EXECUTION PLAN ANALYSIS
-- ============================================================================

-- J1. Analyze Index Utilization on Order Lookup by User and Date
EXPLAIN
SELECT o.id, o.order_number, o.total_amount, o.status, r.name 
FROM `orders` o
INNER JOIN `restaurants` r ON o.restaurant_id = r.id
WHERE o.user_id = 3 AND o.created_at >= '2026-09-01';

-- J2. Analyze Reservation Lookup using Composite Slot Index
EXPLAIN
SELECT id, reservation_code, table_id, party_size 
FROM `reservations`
WHERE restaurant_id = 1 
  AND reservation_date = '2026-10-25' 
  AND reservation_time = '20:00:00'
  AND status = 'confirmed';
