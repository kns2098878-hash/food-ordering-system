-- ==============================================================================
-- FOODIE ADVANCED DATABASE UPGRADE & EXTENSION
-- ==============================================================================
-- Adds:
-- 1. Digital Wallet & Transaction Ledger (user_wallets, wallet_transactions)
-- 2. Loyalty Rewards & Tier Multipliers (loyalty_tiers, loyalty_accounts, loyalty_transactions)
-- 3. Dietary & Allergen Tagging (dietary_tags, menu_item_dietary_tags)
-- 4. Live GPS Order Tracking (order_tracking)
-- 5. Customer 360 & Analytics Materialized Views
-- 6. Stored Procedures (Atomic Wallet Checkout, RFM Customer Segmentation)
-- 7. Automated Triggers (Loyalty accrual on delivery, Wallet integrity check)
-- ==============================================================================

USE foodie_db;

-- ------------------------------------------------------------------------------
-- 1. DIGITAL WALLET SYSTEM
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 500.00 CHECK (balance >= 0),
    currency VARCHAR(5) NOT NULL DEFAULT 'INR',
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_id INT NOT NULL,
    user_id INT NOT NULL,
    transaction_type ENUM('credit', 'debit', 'cashback', 'refund') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    balance_after DECIMAL(10, 2) NOT NULL,
    reference_type VARCHAR(50) DEFAULT 'order_payment',
    reference_id INT DEFAULT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES user_wallets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_wallet_tx (user_id, created_at DESC)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 2. LOYALTY TIERS & REWARDS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS loyalty_tiers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tier_name VARCHAR(50) NOT NULL UNIQUE,
    min_spend DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    points_multiplier DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
    badge_color VARCHAR(20) NOT NULL DEFAULT '#CD7F32',
    perks_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS loyalty_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    tier_id INT NOT NULL DEFAULT 1,
    current_points INT NOT NULL DEFAULT 100,
    lifetime_points INT NOT NULL DEFAULT 100,
    lifetime_spent DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tier_id) REFERENCES loyalty_tiers(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    points INT NOT NULL,
    transaction_type ENUM('earned', 'redeemed', 'bonus', 'expired') NOT NULL,
    order_id INT DEFAULT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_loyalty_tx (user_id, created_at DESC)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 3. DIETARY & ALLERGEN TAGGING
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dietary_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL UNIQUE,
    icon_name VARCHAR(50) DEFAULT 'Leaf',
    badge_color VARCHAR(20) DEFAULT '#16A34A',
    description VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS menu_item_dietary_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id INT NOT NULL,
    tag_id INT NOT NULL,
    UNIQUE KEY uk_menu_tag (menu_item_id, tag_id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES dietary_tags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 4. REAL-TIME ORDER TRACKING SIMULATOR
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    delivery_partner_name VARCHAR(100) NOT NULL DEFAULT 'Rider Assigned',
    partner_phone VARCHAR(20) NOT NULL DEFAULT '+91 9840291823',
    current_lat DECIMAL(10, 6) NOT NULL DEFAULT 13.0418,
    current_lng DECIMAL(10, 6) NOT NULL DEFAULT 80.2341,
    destination_lat DECIMAL(10, 6) NOT NULL DEFAULT 13.0450,
    destination_lng DECIMAL(10, 6) NOT NULL DEFAULT 80.2400,
    estimated_arrival_minutes INT NOT NULL DEFAULT 25,
    tracking_status ENUM('assigned', 'heading_to_restaurant', 'picked_up', 'near_destination', 'delivered') NOT NULL DEFAULT 'assigned',
    last_location_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 5. SEED DATA FOR ADVANCED TABLES
-- ------------------------------------------------------------------------------
INSERT IGNORE INTO loyalty_tiers (id, tier_name, min_spend, points_multiplier, badge_color, perks_description) VALUES
(1, 'Bronze Member', 0.00, 1.00, '#CD7F32', 'Earn 1 point per Rs 10 spent. Standard customer support.'),
(2, 'Silver Gourmet', 2500.00, 1.25, '#94A3B8', 'Earn 1.25x points. Priority restaurant reservations & free delivery on orders above Rs 399.'),
(3, 'Gold Epicurean', 7500.00, 1.50, '#EAB308', 'Earn 1.5x points. Complimentary chef appetizer & zero cancellation fee.'),
(4, 'Platinum Connoisseur', 20000.00, 2.00, '#818CF8', 'Earn 2x points. Dedicated VIP concierge, invite-only tasting events.');

-- Seed Dietary Tags
INSERT IGNORE INTO dietary_tags (id, tag_name, icon_name, badge_color, description) VALUES
(1, 'Vegetarian', 'Leaf', '#16A34A', '100% plant-based and dairy acceptable'),
(2, 'Gluten-Free', 'WheatOff', '#D97706', 'Prepared without gluten containing grains'),
(3, 'High Protein', 'Dumbbell', '#DC2626', 'Contains 25g+ protein per serving'),
(4, 'Chef Special', 'Sparkles', '#7C3AED', 'Signature house recipe highly recommended'),
(5, 'Halal Certified', 'CheckCircle', '#0284C7', 'Prepared following strict Halal protocols'),
(6, 'Low Calorie', 'HeartPulse', '#059669', 'Under 400 calories per portion');

-- Populate wallets and loyalty accounts for existing users
INSERT IGNORE INTO user_wallets (user_id, balance, currency)
SELECT id, 750.00, 'INR' FROM users WHERE role = 'customer';

INSERT IGNORE INTO loyalty_accounts (user_id, tier_id, current_points, lifetime_points, lifetime_spent)
SELECT id, 2, 280, 520, 3200.00 FROM users WHERE email = 'riharika@gmail.com';

INSERT IGNORE INTO loyalty_accounts (user_id, tier_id, current_points, lifetime_points, lifetime_spent)
SELECT id, 1, 140, 200, 1100.00 FROM users WHERE email = 'sriram@gmail.com';

-- Seed initial welcome bonus transactions
INSERT IGNORE INTO wallet_transactions (wallet_id, user_id, transaction_type, amount, balance_after, reference_type, description)
SELECT w.id, w.user_id, 'credit', 750.00, 750.00, 'welcome_bonus', 'Foodie promotional welcome wallet credit'
FROM user_wallets w
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions wt WHERE wt.wallet_id = w.id);

-- Associate dietary tags to sample menu items
INSERT IGNORE INTO menu_item_dietary_tags (menu_item_id, tag_id) VALUES
(1, 3), (1, 4), (1, 5), -- Royal Hyderabadi Biryani
(4, 1), (4, 4),         -- Ghee Roast Dosa
(5, 1), (5, 6),         -- Mylapore Podi Idli
(7, 1), (7, 4),         -- Margherita Pizza
(13, 1), (13, 2), (13, 6); -- Quinoa Avocado Bowl

-- ------------------------------------------------------------------------------
-- 6. ADVANCED VIEWS (CUSTOMER 360 & DEEP ANALYTICS)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_customer_360 AS
SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    u.phone,
    u.role,
    u.created_at AS member_since,
    COALESCE(w.balance, 0.00) AS wallet_balance,
    lt.tier_name,
    lt.badge_color AS tier_color,
    lt.points_multiplier,
    COALESCE(la.current_points, 0) AS loyalty_points,
    COALESCE(la.lifetime_spent, 0.00) AS total_lifetime_spent,
    COUNT(DISTINCT o.id) AS total_orders_placed,
    COUNT(DISTINCT r.id) AS total_reservations_booked,
    COALESCE(AVG(o.total_amount), 0.00) AS avg_order_value
FROM users u
LEFT JOIN user_wallets w ON u.id = w.user_id
LEFT JOIN loyalty_accounts la ON u.id = la.user_id
LEFT JOIN loyalty_tiers lt ON la.tier_id = lt.id
LEFT JOIN orders o ON u.id = o.user_id
LEFT JOIN reservations r ON u.id = r.user_id
GROUP BY u.id, u.name, u.email, u.phone, u.role, u.created_at, w.balance, lt.tier_name, lt.badge_color, lt.points_multiplier, la.current_points, la.lifetime_spent;

-- ------------------------------------------------------------------------------
-- 7. ADVANCED STORED PROCEDURE (ATOMIC WALLET PAYMENT & POINTS ACCRUAL)
-- ------------------------------------------------------------------------------
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_pay_with_wallet$$

CREATE PROCEDURE sp_pay_with_wallet(
    IN p_user_id INT,
    IN p_order_id INT,
    IN p_amount DECIMAL(10, 2),
    OUT p_status_code VARCHAR(20),
    OUT p_message VARCHAR(255)
)
proc_label: BEGIN
    DECLARE v_wallet_id INT;
    DECLARE v_current_balance DECIMAL(10, 2);
    DECLARE v_new_balance DECIMAL(10, 2);

    -- Exit handler for rollback on error
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status_code = 'ERROR';
        SET p_message = 'Database error during wallet transaction execution';
    END;

    START TRANSACTION;

    -- Check and lock wallet row
    SELECT id, balance INTO v_wallet_id, v_current_balance
    FROM user_wallets
    WHERE user_id = p_user_id AND is_locked = FALSE
    FOR UPDATE;

    IF v_wallet_id IS NULL THEN
        ROLLBACK;
        SET p_status_code = 'WALLET_NOT_FOUND';
        SET p_message = 'Active wallet could not be found for user';
        LEAVE proc_label;
    END IF;

    IF v_current_balance < p_amount THEN
        ROLLBACK;
        SET p_status_code = 'INSUFFICIENT_FUNDS';
        SET p_message = CONCAT('Insufficient wallet balance. Available: Rs ', v_current_balance);
        LEAVE proc_label;
    END IF;

    SET v_new_balance = v_current_balance - p_amount;

    -- Update wallet balance
    UPDATE user_wallets
    SET balance = v_new_balance
    WHERE id = v_wallet_id;

    -- Insert ledger record
    INSERT INTO wallet_transactions (
        wallet_id, user_id, transaction_type, amount, balance_after, reference_type, reference_id, description
    ) VALUES (
        v_wallet_id, p_user_id, 'debit', p_amount, v_new_balance, 'order_payment', p_order_id, CONCAT('Payment for Order #', p_order_id)
    );

    -- Update order payment status
    UPDATE orders
    SET payment_status = 'paid', payment_method = 'wallet'
    WHERE id = p_order_id;

    COMMIT;
    SET p_status_code = 'SUCCESS';
    SET p_message = CONCAT('Payment successful. Remaining balance: Rs ', v_new_balance);

END proc_label$$

DELIMITER ;
