-- ============================================================================
-- FOODIE ADVANCED FOOD ORDERING & RESTAURANT RESERVATION SYSTEM
-- Database Schema Definition (MySQL 8.0+)
-- Target Normalization: 3NF Relational Model with 22 Entities
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `foodie_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `foodie_db`;

-- Disable foreign key checks for clean tear down
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `delivery_assignments`;
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `coupon_redemptions`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `reservation_status_history`;
DROP TABLE IF EXISTS `reservations`;
DROP TABLE IF EXISTS `restaurant_tables`;
DROP TABLE IF EXISTS `order_status_history`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `menu_item_options`;
DROP TABLE IF EXISTS `menu_items`;
DROP TABLE IF EXISTS `menu_categories`;
DROP TABLE IF EXISTS `restaurant_hours`;
DROP TABLE IF EXISTS `restaurants`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `menu`;

DROP VIEW IF EXISTS `v_restaurant_performance`;
DROP VIEW IF EXISTS `v_order_summary`;
DROP VIEW IF EXISTS `v_restaurant_menu`;

DROP PROCEDURE IF EXISTS `sp_create_order_atomic`;
DROP PROCEDURE IF EXISTS `sp_generate_sales_report`;

DROP TRIGGER IF EXISTS `trg_after_order_status_update`;
DROP TRIGGER IF EXISTS `trg_after_reservation_status_update`;
DROP TRIGGER IF EXISTS `trg_after_review_insert`;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. USERS
-- ----------------------------------------------------------------------------
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('customer', 'admin', 'restaurant_owner', 'delivery_partner') NOT NULL DEFAULT 'customer',
    `phone` VARCHAR(20) DEFAULT NULL,
    `avatar_url` VARCHAR(500) DEFAULT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. ADDRESSES
-- ----------------------------------------------------------------------------
CREATE TABLE `addresses` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `title` VARCHAR(50) NOT NULL DEFAULT 'Home', -- e.g. Home, Work, Other
    `recipient_name` VARCHAR(120) DEFAULT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `address_line1` VARCHAR(255) NOT NULL,
    `address_line2` VARCHAR(255) DEFAULT NULL,
    `landmark` VARCHAR(150) DEFAULT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    `postal_code` VARCHAR(20) NOT NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_addresses_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. RESTAURANTS
-- ----------------------------------------------------------------------------
CREATE TABLE `restaurants` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `owner_id` INT DEFAULT NULL,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(160) NOT NULL UNIQUE,
    `tagline` VARCHAR(255) DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `cuisine_type` VARCHAR(120) NOT NULL DEFAULT 'Multi-Cuisine',
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL DEFAULT 'Chennai',
    `phone` VARCHAR(25) NOT NULL,
    `email` VARCHAR(150) DEFAULT NULL,
    `image_url` VARCHAR(500) DEFAULT NULL,
    `banner_url` VARCHAR(500) DEFAULT NULL,
    `rating` DECIMAL(3,2) NOT NULL DEFAULT 4.50,
    `rating_count` INT NOT NULL DEFAULT 0,
    `price_tier` ENUM('$', '$$', '$$$', '$$$$') NOT NULL DEFAULT '$$',
    `delivery_fee` DECIMAL(10,2) NOT NULL DEFAULT 30.00,
    `estimated_delivery_time` VARCHAR(30) NOT NULL DEFAULT '30-45 mins',
    `is_pure_veg` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_restaurants_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_restaurants_city` (`city`),
    INDEX `idx_restaurants_rating` (`rating`),
    INDEX `idx_restaurants_cuisine` (`cuisine_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. RESTAURANT_HOURS
-- ----------------------------------------------------------------------------
CREATE TABLE `restaurant_hours` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `restaurant_id` INT NOT NULL,
    `day_of_week` TINYINT NOT NULL COMMENT '0=Sunday, 1=Monday, ..., 6=Saturday',
    `opening_time` TIME NOT NULL,
    `closing_time` TIME NOT NULL,
    `is_closed` BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT `fk_hours_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uq_restaurant_day` (`restaurant_id`, `day_of_week`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. MENU_CATEGORIES
-- ----------------------------------------------------------------------------
CREATE TABLE `menu_categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `restaurant_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `display_order` INT NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_categories_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
    INDEX `idx_categories_restaurant` (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. MENU_ITEMS
-- ----------------------------------------------------------------------------
CREATE TABLE `menu_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `restaurant_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `discount_price` DECIMAL(10,2) DEFAULT NULL,
    `image_url` VARCHAR(500) DEFAULT NULL,
    `is_vegetarian` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_spicy` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_popular` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_available` BOOLEAN NOT NULL DEFAULT TRUE,
    `preparation_time` INT NOT NULL DEFAULT 20 COMMENT 'minutes',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_items_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_items_category` FOREIGN KEY (`category_id`) REFERENCES `menu_categories` (`id`) ON DELETE CASCADE,
    INDEX `idx_items_restaurant` (`restaurant_id`),
    INDEX `idx_items_category` (`category_id`),
    INDEX `idx_items_available` (`is_available`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. MENU_ITEM_OPTIONS (Customizations & Addons)
-- ----------------------------------------------------------------------------
CREATE TABLE `menu_item_options` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `menu_item_id` INT NOT NULL,
    `group_name` VARCHAR(80) NOT NULL DEFAULT 'Add-ons', -- e.g. Portion Size, Spice Level, Extras
    `name` VARCHAR(100) NOT NULL,
    `price_adjustment` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `is_default` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_options_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE,
    INDEX `idx_options_item` (`menu_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. CART_ITEMS (Persistent Cart)
-- ----------------------------------------------------------------------------
CREATE TABLE `cart_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `menu_item_id` INT NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1 CHECK (`quantity` > 0),
    `customization_notes` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_cart_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uq_user_item` (`user_id`, `menu_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. ORDERS
-- ----------------------------------------------------------------------------
CREATE TABLE `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_number` VARCHAR(32) NOT NULL UNIQUE,
    `user_id` INT NOT NULL,
    `restaurant_id` INT NOT NULL,
    `address_id` INT DEFAULT NULL,
    `delivery_address_text` TEXT NOT NULL,
    `phone` VARCHAR(25) NOT NULL,
    `status` ENUM('placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL DEFAULT 'placed',
    `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `tax_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `delivery_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `total_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `coupon_code` VARCHAR(50) DEFAULT NULL,
    `payment_method` ENUM('demo_card', 'demo_upi', 'cash_on_delivery') NOT NULL DEFAULT 'demo_upi',
    `payment_status` ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    `customer_notes` VARCHAR(255) DEFAULT NULL,
    `cancellation_reason` VARCHAR(255) DEFAULT NULL,
    `estimated_delivery_at` DATETIME DEFAULT NULL,
    `delivered_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_orders_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_orders_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL,
    INDEX `idx_orders_user` (`user_id`),
    INDEX `idx_orders_restaurant` (`restaurant_id`),
    INDEX `idx_orders_status` (`status`),
    INDEX `idx_orders_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. ORDER_ITEMS (Snapshot preserving item name & unit price)
-- ----------------------------------------------------------------------------
CREATE TABLE `order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `menu_item_id` INT DEFAULT NULL,
    `item_name` VARCHAR(150) NOT NULL,
    `unit_price` DECIMAL(10,2) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1 CHECK (`quantity` > 0),
    `subtotal` DECIMAL(10,2) NOT NULL,
    `customization_notes` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_order_items_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE SET NULL,
    INDEX `idx_order_items_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. ORDER_STATUS_HISTORY
-- ----------------------------------------------------------------------------
CREATE TABLE `order_status_history` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `previous_status` VARCHAR(40) DEFAULT NULL,
    `new_status` VARCHAR(40) NOT NULL,
    `changed_by_user_id` INT DEFAULT NULL,
    `notes` VARCHAR(255) DEFAULT NULL,
    `changed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_osh_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_osh_user` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_osh_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 12. RESTAURANT_TABLES
-- ----------------------------------------------------------------------------
CREATE TABLE `restaurant_tables` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `restaurant_id` INT NOT NULL,
    `table_number` INT NOT NULL,
    `table_name` VARCHAR(60) NOT NULL,
    `capacity` INT NOT NULL DEFAULT 4 CHECK (`capacity` > 0),
    `section` ENUM('indoor', 'patio', 'rooftop', 'vip') NOT NULL DEFAULT 'indoor',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT `fk_tables_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uq_table_per_restaurant` (`restaurant_id`, `table_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 13. RESERVATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE `reservations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `reservation_code` VARCHAR(32) NOT NULL UNIQUE,
    `user_id` INT NOT NULL,
    `restaurant_id` INT NOT NULL,
    `table_id` INT DEFAULT NULL,
    `reservation_date` DATE NOT NULL,
    `reservation_time` TIME NOT NULL,
    `party_size` INT NOT NULL CHECK (`party_size` > 0),
    `status` ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') NOT NULL DEFAULT 'confirmed',
    `special_requests` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_reservations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_reservations_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_reservations_table` FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`id`) ON DELETE SET NULL,
    INDEX `idx_reservations_user` (`user_id`),
    INDEX `idx_reservations_restaurant` (`restaurant_id`),
    INDEX `idx_reservations_slot` (`restaurant_id`, `reservation_date`, `reservation_time`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 14. RESERVATION_STATUS_HISTORY
-- ----------------------------------------------------------------------------
CREATE TABLE `reservation_status_history` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `reservation_id` INT NOT NULL,
    `previous_status` VARCHAR(40) DEFAULT NULL,
    `new_status` VARCHAR(40) NOT NULL,
    `changed_by_user_id` INT DEFAULT NULL,
    `notes` VARCHAR(255) DEFAULT NULL,
    `changed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_rsh_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_rsh_user` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_rsh_reservation` (`reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 15. COUPONS
-- ----------------------------------------------------------------------------
CREATE TABLE `coupons` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `title` VARCHAR(120) NOT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `discount_type` ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
    `discount_value` DECIMAL(10,2) NOT NULL,
    `min_order_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `max_discount_amount` DECIMAL(10,2) DEFAULT NULL,
    `valid_from` DATETIME NOT NULL,
    `valid_to` DATETIME NOT NULL,
    `usage_limit` INT NOT NULL DEFAULT 500,
    `times_used` INT NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_coupons_code` (`code`),
    INDEX `idx_coupons_active` (`is_active`, `valid_to`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 16. COUPON_REDEMPTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE `coupon_redemptions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `coupon_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `order_id` INT NOT NULL,
    `discount_applied` DECIMAL(10,2) NOT NULL,
    `redeemed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_redemptions_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_redemptions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_redemptions_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uq_coupon_order` (`coupon_id`, `order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 17. PAYMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE `payments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `transaction_ref` VARCHAR(64) NOT NULL UNIQUE,
    `payment_method` ENUM('demo_card', 'demo_upi', 'cash_on_delivery') NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
    `status` ENUM('initiated', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'completed',
    `payment_gateway_response` TEXT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    INDEX `idx_payments_order` (`order_id`),
    INDEX `idx_payments_ref` (`transaction_ref`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 18. REVIEWS
-- ----------------------------------------------------------------------------
CREATE TABLE `reviews` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `restaurant_id` INT NOT NULL,
    `order_id` INT DEFAULT NULL,
    `rating` TINYINT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `comment` TEXT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_reviews_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_reviews_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
    INDEX `idx_reviews_restaurant` (`restaurant_id`),
    INDEX `idx_reviews_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 19. FAVORITES
-- ----------------------------------------------------------------------------
CREATE TABLE `favorites` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `restaurant_id` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_favorites_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uq_user_fav_restaurant` (`user_id`, `restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 20. DELIVERY_ASSIGNMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE `delivery_assignments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `driver_name` VARCHAR(100) NOT NULL,
    `driver_phone` VARCHAR(25) NOT NULL,
    `vehicle_number` VARCHAR(30) DEFAULT NULL,
    `status` ENUM('assigned', 'picked_up', 'delivered') NOT NULL DEFAULT 'assigned',
    `assigned_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `picked_up_at` DATETIME DEFAULT NULL,
    `delivered_at` DATETIME DEFAULT NULL,
    CONSTRAINT `fk_delivery_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    INDEX `idx_delivery_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 21. NOTIFICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE `notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `type` ENUM('order', 'reservation', 'promo', 'system') NOT NULL DEFAULT 'system',
    `reference_id` INT DEFAULT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_notifications_user` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 22. AUDIT_LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE `audit_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT DEFAULT NULL,
    `action` VARCHAR(80) NOT NULL,
    `entity_type` VARCHAR(60) NOT NULL,
    `entity_id` INT DEFAULT NULL,
    `details` JSON DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_audit_action` (`action`),
    INDEX `idx_audit_entity` (`entity_type`, `entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- SQL VIEWS (Demonstrating Multi-Table Joins & Pre-Aggregated Insights)
-- ============================================================================

-- View 1: Restaurant Menu with Category Details
CREATE OR REPLACE VIEW `v_restaurant_menu` AS
SELECT 
    m.id AS item_id,
    m.name AS item_name,
    m.description AS item_description,
    m.price,
    m.discount_price,
    COALESCE(m.discount_price, m.price) AS effective_price,
    m.image_url,
    m.is_vegetarian,
    m.is_spicy,
    m.is_popular,
    m.is_available,
    c.id AS category_id,
    c.name AS category_name,
    r.id AS restaurant_id,
    r.name AS restaurant_name,
    r.city AS restaurant_city
FROM `menu_items` m
INNER JOIN `menu_categories` c ON m.category_id = c.id
INNER JOIN `restaurants` r ON m.restaurant_id = r.id;

-- View 2: Order Summary with Aggregations and User Info
CREATE OR REPLACE VIEW `v_order_summary` AS
SELECT 
    o.id AS order_id,
    o.order_number,
    o.created_at AS order_date,
    o.status AS order_status,
    o.total_amount,
    o.payment_method,
    o.payment_status,
    u.id AS user_id,
    u.name AS customer_name,
    u.email AS customer_email,
    r.id AS restaurant_id,
    r.name AS restaurant_name,
    COUNT(oi.id) AS total_distinct_items,
    COALESCE(SUM(oi.quantity), 0) AS total_quantity
FROM `orders` o
INNER JOIN `users` u ON o.user_id = u.id
INNER JOIN `restaurants` r ON o.restaurant_id = r.id
LEFT JOIN `order_items` oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, o.created_at, o.status, o.total_amount, 
         o.payment_method, o.payment_status, u.id, u.name, u.email, r.id, r.name;

-- View 3: Restaurant Performance View
CREATE OR REPLACE VIEW `v_restaurant_performance` AS
SELECT 
    r.id AS restaurant_id,
    r.name AS restaurant_name,
    r.cuisine_type,
    r.rating,
    r.rating_count,
    COUNT(DISTINCT o.id) AS total_orders,
    COALESCE(SUM(CASE WHEN o.status = 'delivered' THEN o.total_amount ELSE 0 END), 0) AS total_revenue,
    COUNT(DISTINCT res.id) AS total_reservations
FROM `restaurants` r
LEFT JOIN `orders` o ON r.id = o.restaurant_id
LEFT JOIN `reservations` res ON r.id = res.restaurant_id
GROUP BY r.id, r.name, r.cuisine_type, r.rating, r.rating_count;


-- ============================================================================
-- STORED PROCEDURES (ACID Safe Procedures)
-- ============================================================================

DELIMITER $$

-- Stored Procedure 1: Atomic Order Creation Helper
CREATE PROCEDURE `sp_create_order_atomic`(
    IN p_user_id INT,
    IN p_restaurant_id INT,
    IN p_address_id INT,
    IN p_delivery_address TEXT,
    IN p_phone VARCHAR(25),
    IN p_subtotal DECIMAL(10,2),
    IN p_tax DECIMAL(10,2),
    IN p_delivery_fee DECIMAL(10,2),
    IN p_discount DECIMAL(10,2),
    IN p_total DECIMAL(10,2),
    IN p_coupon_code VARCHAR(50),
    IN p_payment_method VARCHAR(30),
    OUT p_order_id INT,
    OUT p_order_number VARCHAR(32)
)
BEGIN
    DECLARE v_ord_num VARCHAR(32);
    SET v_ord_num = CONCAT('ORD-', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '-', LPAD(FLOOR(RAND() * 9000 + 1000), 4, '0'));

    INSERT INTO `orders` (
        `order_number`,
        `user_id`,
        `restaurant_id`,
        `address_id`,
        `delivery_address_text`,
        `phone`,
        `status`,
        `subtotal`,
        `tax_amount`,
        `delivery_fee`,
        `discount_amount`,
        `total_amount`,
        `coupon_code`,
        `payment_method`,
        `payment_status`,
        `created_at`
    ) VALUES (
        v_ord_num,
        p_user_id,
        p_restaurant_id,
        p_address_id,
        p_delivery_address,
        p_phone,
        'placed',
        p_subtotal,
        p_tax,
        p_delivery_fee,
        p_discount,
        p_total,
        p_coupon_code,
        p_payment_method,
        'paid',
        NOW()
    );

    SET p_order_id = LAST_INSERT_ID();
    SET p_order_number = v_ord_num;
END$$

-- Stored Procedure 2: Atomic Sales Report Generation
CREATE PROCEDURE `sp_generate_sales_report`(
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_restaurant_id INT
)
BEGIN
    SELECT 
        DATE(o.created_at) AS report_date,
        COUNT(o.id) AS order_count,
        COALESCE(SUM(o.subtotal), 0.00) AS total_subtotal,
        COALESCE(SUM(o.tax_amount), 0.00) AS total_tax,
        COALESCE(SUM(o.discount_amount), 0.00) AS total_discounts,
        COALESCE(SUM(o.total_amount), 0.00) AS net_revenue
    FROM `orders` o
    WHERE DATE(o.created_at) BETWEEN p_start_date AND p_end_date
      AND (p_restaurant_id IS NULL OR o.restaurant_id = p_restaurant_id)
      AND o.status != 'cancelled'
    GROUP BY DATE(o.created_at)
    ORDER BY report_date ASC;
END$$

DELIMITER ;


-- ============================================================================
-- TRIGGERS (Automated Audit Trails and Calculations)
-- ============================================================================

DELIMITER $$

-- Trigger 1: Log order status transitions automatically
CREATE TRIGGER `trg_after_order_status_update`
AFTER UPDATE ON `orders`
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO `order_status_history` (
            `order_id`,
            `previous_status`,
            `new_status`,
            `changed_by_user_id`,
            `notes`,
            `changed_at`
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            NULL,
            CONCAT('Automatic status transition from ', OLD.status, ' to ', NEW.status),
            NOW()
        );
    END IF;
END$$

-- Trigger 2: Log reservation status transitions automatically
CREATE TRIGGER `trg_after_reservation_status_update`
AFTER UPDATE ON `reservations`
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO `reservation_status_history` (
            `reservation_id`,
            `previous_status`,
            `new_status`,
            `changed_by_user_id`,
            `notes`,
            `changed_at`
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            NULL,
            CONCAT('Reservation transitioned from ', OLD.status, ' to ', NEW.status),
            NOW()
        );
    END IF;
END$$

-- Trigger 3: Recalculate restaurant rating after review insertion
CREATE TRIGGER `trg_after_review_insert`
AFTER INSERT ON `reviews`
FOR EACH ROW
BEGIN
    DECLARE avg_rating DECIMAL(3,2);
    DECLARE total_rev INT;

    SELECT 
        ROUND(AVG(rating), 2),
        COUNT(*)
    INTO avg_rating, total_rev
    FROM `reviews`
    WHERE `restaurant_id` = NEW.restaurant_id;

    UPDATE `restaurants`
    SET `rating` = avg_rating,
        `rating_count` = total_rev
    WHERE `id` = NEW.restaurant_id;
END$$

DELIMITER ;
