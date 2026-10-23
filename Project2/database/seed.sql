-- ============================================================================
-- FOODIE ADVANCED FOOD ORDERING & RESTAURANT RESERVATION SYSTEM
-- Realistic Academic Demonstration Seed Data (MySQL 8.0+)
-- ============================================================================

USE `foodie_db`;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `audit_logs`;
TRUNCATE TABLE `notifications`;
TRUNCATE TABLE `delivery_assignments`;
TRUNCATE TABLE `favorites`;
TRUNCATE TABLE `reviews`;
TRUNCATE TABLE `payments`;
TRUNCATE TABLE `coupon_redemptions`;
TRUNCATE TABLE `coupons`;
TRUNCATE TABLE `reservation_status_history`;
TRUNCATE TABLE `reservations`;
TRUNCATE TABLE `restaurant_tables`;
TRUNCATE TABLE `order_status_history`;
TRUNCATE TABLE `order_items`;
TRUNCATE TABLE `orders`;
TRUNCATE TABLE `cart_items`;
TRUNCATE TABLE `menu_item_options`;
TRUNCATE TABLE `menu_items`;
TRUNCATE TABLE `menu_categories`;
TRUNCATE TABLE `restaurant_hours`;
TRUNCATE TABLE `restaurants`;
TRUNCATE TABLE `addresses`;
TRUNCATE TABLE `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. USERS
-- Password Mapping:
-- admin@foodie.com     => admin123
-- owner@biryaniking.com => owner123
-- riharika@gmail.com   => 123456
-- sriram@gmail.com     => sriram123
-- ----------------------------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `phone`, `avatar_url`, `is_active`, `created_at`) VALUES
(1, 'System Administrator', 'admin@foodie.com', 'scrypt:32768:8:1$e9lFNAaBxud2kPsv$ecfaa3f9e8c3923db7ed7a956da1bdec0a9aab6eb81cc8a3fcf9337d1b328e7b4bd91b1108bc4ae720b9df30bc943b2e3263552e3c840517de86ef12d6191cbf', 'admin', '+91 9876543210', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', 1, '2026-09-01 10:00:00'),
(2, 'Farhan Khan', 'owner@biryaniking.com', 'scrypt:32768:8:1$dids3CljC66ULLCN$31e7a8650e82081c546cf2c6a4ef8a1d7878d2903e245146c7c2d1307e6f669e5c0923950a7eb826e78ac11099fc98d8aa1fb55e4a1c0a1c30783a6c1a51cd8c', 'restaurant_owner', '+91 9840112233', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', 1, '2026-09-01 10:30:00'),
(3, 'Riharika Rao', 'riharika@gmail.com', 'scrypt:32768:8:1$yW9PQchGaUG2l2pX$9ee61d8118a5462461b18235e22b5577bda87523ec2db8e0db4b43fa0b38e479e607772b20a124687880a78a90874b84bdf4f04bcbaaaf2691a9ba2229f3a9e7', 'customer', '+91 9884019283', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', 1, '2026-09-02 11:15:00'),
(4, 'Sriram Krishnan', 'sriram@gmail.com', 'scrypt:32768:8:1$ThbtlfhlRz1PqY5Y$8ab99cc7b17e0fe08be19a921ff83d64e02f2b009857f94817e07890d5a157a46981763b8c8fc657c589648eb527cb9597872d18804d3cbcc1476268d261fc39', 'customer', '+91 9791029384', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', 1, '2026-09-02 12:00:00');

-- ----------------------------------------------------------------------------
-- 2. ADDRESSES
-- ----------------------------------------------------------------------------
INSERT INTO `addresses` (`id`, `user_id`, `title`, `recipient_name`, `phone`, `address_line1`, `address_line2`, `landmark`, `city`, `state`, `postal_code`, `is_default`, `created_at`) VALUES
(1, 3, 'Home', 'Riharika Rao', '+91 9884019283', 'Flat 4B, Emerald Residency', '12 Burkit Road, T. Nagar', 'Near Pondy Bazaar', 'Chennai', 'Tamil Nadu', '600017', 1, '2026-09-05 14:00:00'),
(2, 3, 'Office', 'Riharika Rao', '+91 9884019283', 'DLF CyberCity, Block 7, 3rd Floor', 'Manapakkam', 'Opposite L&T Infotech', 'Chennai', 'Tamil Nadu', '600089', 0, '2026-09-06 09:30:00'),
(3, 4, 'Home', 'Sriram Krishnan', '+91 9791029384', 'House 24, 2nd Avenue', 'Shanthi Colony, Anna Nagar', 'Near Roundana', 'Chennai', 'Tamil Nadu', '600040', 1, '2026-09-07 16:45:00');

-- ----------------------------------------------------------------------------
-- 3. RESTAURANTS
-- ----------------------------------------------------------------------------
INSERT INTO `restaurants` (`id`, `owner_id`, `name`, `slug`, `tagline`, `description`, `cuisine_type`, `address`, `city`, `phone`, `email`, `image_url`, `banner_url`, `rating`, `rating_count`, `price_tier`, `delivery_fee`, `estimated_delivery_time`, `is_pure_veg`, `is_active`, `created_at`) VALUES
(1, 2, 'The Royal Biryani House', 'the-royal-biryani-house', 'Authentic Dum Biryanis & Royal Kebabs', 'Famed for slow-cooked Awadhi and Hyderabadi dum biryanis layered with fragrant basmati rice and handpicked artisanal spices.', 'Biryani & Mughlai', '45 Usman Road, T. Nagar', 'Chennai', '+91 44 2434 8899', 'info@royalbiryani.com', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', 4.80, 248, '$$', 35.00, '30-40 mins', 0, 1, '2026-09-01 12:00:00'),
(2, NULL, 'Dakshin Flavors', 'dakshin-flavors', 'Heritage South Indian Delicacies', 'Crispy golden dosas, heritage Chettinad curries, steaming idlis, and authentic filter coffee prepared according to multi-generational recipes.', 'South Indian', '18 North Mada Street, Mylapore', 'Chennai', '+91 44 2464 1234', 'taste@dakshinflavors.in', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800', 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1200', 4.70, 182, '$$', 25.00, '25-35 mins', 1, 1, '2026-09-01 12:30:00'),
(3, NULL, 'Little Italy Trattoria', 'little-italy-trattoria', 'Handcrafted Pasta & Wood-Fired Pizza', 'Authentic artisanal Neapolitan pizzas fired at 450 degrees alongside fresh hand-rolled pasta, rich pestos, and velvety tiramisu.', 'Italian & Continental', '72 Khader Nawaz Khan Road, Nungambakkam', 'Chennai', '+91 44 4211 9900', 'ciao@littleitaly.com', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', 4.60, 145, '$$$', 45.00, '35-45 mins', 0, 1, '2026-09-01 13:00:00'),
(4, NULL, 'Dragon Wok & Dim Sum', 'dragon-wok-dim-sum', 'Modern Pan-Asian Street Food', 'Steaming handmade dumplings, wok-tossed Cantonese noodles, crispy spicy appetizers, and aromatic Thai red and green curries.', 'Pan-Asian & Chinese', '88 Velachery Main Road, Velachery', 'Chennai', '+91 44 2244 5566', 'contact@dragonwok.com', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1200', 4.50, 120, '$$', 30.00, '30-40 mins', 0, 1, '2026-09-01 13:30:00'),
(5, NULL, 'Green Harvest Kitchen', 'green-harvest-kitchen', 'Fresh Organic Gourmet & Healthy Bowls', 'Farm-to-fork plant-based bowls, sourdough toasts, high-protein quinoa salads, cold-pressed elixirs, and guilt-free desserts.', 'Healthy & Salads', '14 Chamiers Road, Alwarpet', 'Chennai', '+91 44 2435 7788', 'hello@greenharvest.org', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200', 4.90, 310, '$$', 20.00, '20-30 mins', 1, 1, '2026-09-01 14:00:00');

-- ----------------------------------------------------------------------------
-- 4. RESTAURANT_HOURS (Covering all 7 days)
-- ----------------------------------------------------------------------------
INSERT INTO `restaurant_hours` (`restaurant_id`, `day_of_week`, `opening_time`, `closing_time`, `is_closed`) VALUES
(1, 0, '11:00:00', '23:30:00', 0),
(1, 1, '11:00:00', '23:00:00', 0),
(1, 2, '11:00:00', '23:00:00', 0),
(1, 3, '11:00:00', '23:00:00', 0),
(1, 4, '11:00:00', '23:00:00', 0),
(1, 5, '11:00:00', '23:30:00', 0),
(1, 6, '11:00:00', '23:30:00', 0),
(2, 0, '07:00:00', '22:30:00', 0),
(2, 1, '07:00:00', '22:00:00', 0),
(2, 2, '07:00:00', '22:00:00', 0),
(2, 3, '07:00:00', '22:00:00', 0),
(2, 4, '07:00:00', '22:00:00', 0),
(2, 5, '07:00:00', '22:30:00', 0),
(2, 6, '07:00:00', '22:30:00', 0),
(3, 0, '12:00:00', '23:00:00', 0),
(3, 1, '12:00:00', '22:30:00', 0),
(3, 2, '12:00:00', '22:30:00', 0),
(3, 3, '12:00:00', '22:30:00', 0),
(3, 4, '12:00:00', '22:30:00', 0),
(3, 5, '12:00:00', '23:30:00', 0),
(3, 6, '12:00:00', '23:30:00', 0),
(4, 0, '12:00:00', '23:00:00', 0),
(4, 1, '12:00:00', '22:30:00', 0),
(4, 2, '12:00:00', '22:30:00', 0),
(4, 3, '12:00:00', '22:30:00', 0),
(4, 4, '12:00:00', '22:30:00', 0),
(4, 5, '12:00:00', '23:00:00', 0),
(4, 6, '12:00:00', '23:00:00', 0),
(5, 0, '08:00:00', '22:00:00', 0),
(5, 1, '08:00:00', '21:30:00', 0),
(5, 2, '08:00:00', '21:30:00', 0),
(5, 3, '08:00:00', '21:30:00', 0),
(5, 4, '08:00:00', '21:30:00', 0),
(5, 5, '08:00:00', '22:00:00', 0),
(5, 6, '08:00:00', '22:00:00', 0);

-- ----------------------------------------------------------------------------
-- 5. RESTAURANT_TABLES
-- ----------------------------------------------------------------------------
INSERT INTO `restaurant_tables` (`id`, `restaurant_id`, `table_number`, `table_name`, `capacity`, `section`, `is_active`) VALUES
(1, 1, 1, 'Table 1 (Indoor Cozy)', 2, 'indoor', 1),
(2, 1, 2, 'Table 2 (Family Booth)', 4, 'indoor', 1),
(3, 1, 3, 'Table 3 (Family Booth)', 4, 'indoor', 1),
(4, 1, 4, 'Table 4 (Banquet Round)', 6, 'indoor', 1),
(5, 1, 5, 'Table 5 (Courtyard View)', 2, 'patio', 1),
(6, 1, 6, 'Table 6 (Patio Garden)', 4, 'patio', 1),
(7, 1, 7, 'Table 7 (Royal Rooftop)', 4, 'rooftop', 1),
(8, 1, 8, 'Table 8 (Rooftop Starlight)', 6, 'rooftop', 1),
(9, 1, 9, 'Table 9 (Nawab VIP Suite)', 8, 'vip', 1),
(10, 1, 10, 'Table 10 (Nawab VIP Suite)', 10, 'vip', 1),
-- Tables for Dakshin Flavors
(11, 2, 1, 'Heritage Table 1', 2, 'indoor', 1),
(12, 2, 2, 'Heritage Table 2', 4, 'indoor', 1),
(13, 2, 3, 'Courtyard Table 3', 4, 'patio', 1),
(14, 2, 4, 'Tradition Table 4', 6, 'indoor', 1),
(15, 2, 5, 'Chettinad VIP Lounge', 8, 'vip', 1),
-- Tables for Little Italy
(16, 3, 1, 'Piazza Table 1', 2, 'patio', 1),
(17, 3, 2, 'Fireplace Table 2', 4, 'indoor', 1),
(18, 3, 3, 'Terrace Table 3', 4, 'rooftop', 1),
(19, 3, 4, 'Grand Tuscan Room', 8, 'vip', 1),
-- Tables for Dragon Wok
(20, 4, 1, 'Bamboo Table 1', 2, 'indoor', 1),
(21, 4, 2, 'Lotus Table 2', 4, 'indoor', 1),
(22, 4, 3, 'Imperial Dragon Table', 6, 'vip', 1),
-- Tables for Green Harvest
(23, 5, 1, 'Sunlight Nook 1', 2, 'patio', 1),
(24, 5, 2, 'Botanical Booth 2', 4, 'indoor', 1),
(25, 5, 3, 'Greenhouse Terrace 3', 6, 'rooftop', 1);

-- ----------------------------------------------------------------------------
-- 6. MENU_CATEGORIES
-- ----------------------------------------------------------------------------
INSERT INTO `menu_categories` (`id`, `restaurant_id`, `name`, `description`, `display_order`, `is_active`) VALUES
(1, 1, 'Royal Starters & Kebabs', 'Clay oven delicacies marinated with spiced yogurt and saffron', 1, 1),
(2, 1, 'Signature Dum Biryanis', 'Slow-cooked handi biryanis sealed with aromatic dough', 2, 1),
(3, 1, 'Rich Mughlai Curries', 'Velvety gravy preparations with cashews and fragrant herbs', 3, 1),
(4, 1, 'Desserts & Refreshers', 'Decadent sweets and churned lassis', 4, 1),
(5, 2, 'Crispy Dosas & Tiffins', 'Fermented rice batter delicacies served with sambar and fresh chutneys', 1, 1),
(6, 2, 'Chettinad Specialties', 'Fiery coastal and inland curries infused with stone-ground spices', 2, 1),
(7, 2, 'South Traditional Desserts', 'Warm payasam and filter kaapi', 3, 1),
(8, 3, 'Wood-Fired Pizza', 'Crispy airy crust topped with San Marzano tomatoes and fior di latte', 1, 1),
(9, 3, 'Handcrafted Pasta', 'Fresh durum pasta tossed in traditional Italian reductions', 2, 1),
(10, 4, 'Dim Sum & Dumplings', 'Handmade translucent parcels packed with savory goodness', 1, 1),
(11, 4, 'Wok & Claypot Mains', 'Sizzling stir fries and silky noodles', 2, 1),
(12, 5, 'Farm Bowls & Superfoods', 'Nutrient-rich microgreens, grains, and grilled plant proteins', 1, 1),
(13, 5, 'Cold-Pressed Juices & Shakes', 'Zero-sugar 100% natural botanical elixirs', 2, 1);

-- ----------------------------------------------------------------------------
-- 7. MENU_ITEMS
-- ----------------------------------------------------------------------------
INSERT INTO `menu_items` (`id`, `restaurant_id`, `category_id`, `name`, `description`, `price`, `discount_price`, `image_url`, `is_vegetarian`, `is_spicy`, `is_popular`, `is_available`, `preparation_time`) VALUES
-- Restaurant 1: The Royal Biryani House
(1, 1, 1, 'Murg Malai Tikka', 'Tender chicken cubes marinated with heavy cream, cardamom, and roasted gram flour, char-grilled to perfection.', 280.00, 250.00, 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800', 0, 0, 1, 1, 20),
(2, 1, 1, 'Paneer Zafrani Tikka', 'Cottage cheese steeped in saffron-infused yogurt and crushed yellow chili, grilled in tandoor.', 240.00, NULL, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', 1, 1, 0, 1, 18),
(3, 1, 2, 'Royal Hyderabadi Chicken Dum Biryani', 'Long grain aged basmati rice cooked on slow charcoal with tender chicken cuts, mint, and fried onions. Served with Mirchi ka Salan and Raita.', 320.00, 290.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 0, 1, 1, 1, 25),
(4, 1, 2, 'Awadhi Mutton Dum Biryani', 'Juicy prime baby mutton simmered in fragrant broth and layered with rosewater scented saffron rice.', 420.00, NULL, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800', 0, 1, 1, 1, 30),
(5, 1, 2, 'Shahi Subz Dum Biryani', 'Exotic farm vegetables, paneer cubes, and roasted cashews simmered in sealed earthenware with fragrant rice.', 240.00, 220.00, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800', 1, 0, 1, 1, 20),
(6, 1, 3, 'Murgh Butter Masala', 'Charred chicken tikka simmered in a silky tomato, cashew nut, and butter gravy seasoned with kasuri methi.', 310.00, NULL, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800', 0, 0, 1, 1, 20),
(7, 1, 3, 'Dal Makhani Bukhara', 'Whole black lentils slow-simmered overnight over smoldering coals with fresh cream and butter.', 220.00, NULL, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800', 1, 0, 1, 1, 15),
(8, 1, 4, 'Shahi Tukda with Rabri', 'Ghee-fried brioche steeped in saffron syrup, smothered with thick pistachio rabri and edible silver leaf.', 150.00, NULL, 'https://images.unsplash.com/photo-1605197584547-c93de1a02939?w=800', 1, 0, 0, 1, 10),

-- Restaurant 2: Dakshin Flavors
(9, 2, 5, 'Classic Ghee Roast Masala Dosa', 'Golden paper-thin crispy crepe roasted in pure country ghee, filled with spiced potato masala. Served with 3 chutneys.', 130.00, 110.00, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800', 1, 0, 1, 1, 15),
(10, 2, 5, 'Mylapore Podi Idli (4 pcs)', 'Mini coin idlis tossed in gun-powder podi and sizzling hot sesame oil with curry leaves.', 95.00, NULL, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800', 1, 1, 1, 1, 12),
(11, 2, 6, 'Chettinad Mushroom Chukka', 'Button mushrooms pan-roasted with freshly pounded black pepper, fennel seeds, shallots, and curry leaf oil.', 190.00, NULL, 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800', 1, 1, 1, 1, 18),
(12, 2, 6, 'Malabar Parotta with Veg Kurma', 'Flaky, layered handmade flatbread paired with rich coconut and poppy seed vegetable stew.', 160.00, NULL, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', 1, 0, 0, 1, 15),
(13, 2, 7, 'Traditional Kumbakonam Degree Coffee', 'Freshly brewed chicory-infused decoction with frothy whole milk served in authentic brass dabarah.', 55.00, NULL, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800', 1, 0, 1, 1, 8),

-- Restaurant 3: Little Italy Trattoria
(14, 3, 8, 'Margherita Burrata Pizza', 'San Marzano tomato base, fresh buffalo mozzarella, creamy artisanal burrata heart, and sweet basil leaves.', 380.00, 340.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', 1, 0, 1, 1, 22),
(15, 3, 8, 'Diavola Pepperoni Pizza', 'Zesty tomato reduction, spicy Italian salami pepperoni slices, crushed red pepper, and smoked scamorza.', 440.00, NULL, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800', 0, 1, 1, 1, 22),
(16, 3, 9, 'Truffle Mushroom Fettuccine', 'Hand-rolled fresh egg pasta ribbons tossed in a black truffle cream sauce with wild porcini mushrooms and aged parmesan.', 360.00, NULL, 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800', 1, 0, 1, 1, 20),
(17, 3, 9, 'Classic Penne Arrabbiata', 'Al dente penne pasta tossed in fiery chili-garlic tomato sugo with virgin olive oil and torn fresh herbs.', 290.00, NULL, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800', 1, 1, 0, 1, 18),

-- Restaurant 4: Dragon Wok & Dim Sum
(18, 4, 10, 'Crystal Veg Dim Sum (6 pcs)', 'Translucent steamed dumplings stuffed with water chestnuts, shiitake mushrooms, and baby corn with chili dip.', 210.00, 185.00, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800', 1, 0, 1, 1, 16),
(19, 4, 10, 'Chicken Sui Mai (6 pcs)', 'Open-topped steamed wontons filled with seasoned chicken mince, ginger, and tobiko caviar pearls.', 240.00, NULL, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800', 0, 0, 1, 1, 16),
(20, 4, 11, 'Cantonese Hakka Noodles', 'Wok-tossed thin noodles with crunchy scallions, bell peppers, carrots, and light soy sauce.', 180.00, NULL, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', 1, 0, 1, 1, 15),
(21, 4, 11, 'Schezwan Fiery Chicken Rice', 'Jasmine rice tossed with bird eye chilies, crispy diced chicken cubes, and house Sichuan peppercorn sauce.', 230.00, NULL, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800', 0, 1, 1, 1, 18),

-- Restaurant 5: Green Harvest Kitchen
(22, 5, 12, 'Mediterranean Falafel Quinoa Bowl', 'Golden herb falafel fritters over seasoned tri-color quinoa, roasted beetroot hummus, kalamata olives, and tahini drizzle.', 260.00, 230.00, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800', 1, 0, 1, 1, 15),
(23, 5, 12, 'Avocado Sourdough Crunch', 'Toasted rustic sourdough topped with smashed Hass avocado, cherry tomatoes, dukkah seeds, and balsamic glaze.', 210.00, NULL, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800', 1, 0, 1, 1, 12),
(24, 5, 13, 'Golden Glow Detox Juice (350ml)', 'Cold-pressed orange, carrot, fresh ginger root, and raw organic turmeric.', 110.00, NULL, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800', 1, 0, 0, 1, 8);

-- ----------------------------------------------------------------------------
-- 8. MENU_ITEM_OPTIONS (Add-ons & Variations)
-- ----------------------------------------------------------------------------
INSERT INTO `menu_item_options` (`id`, `menu_item_id`, `group_name`, `name`, `price_adjustment`, `is_default`) VALUES
(1, 3, 'Portion Size', 'Regular Single Pack', 0.00, 1),
(2, 3, 'Portion Size', 'Jumbo Family Bucket with Extra Eggs', 180.00, 0),
(3, 3, 'Add-ons', 'Extra Boiled Egg (2 pcs)', 30.00, 0),
(4, 3, 'Add-ons', 'Extra Fried Onions & Mint Raita', 25.00, 0),
(5, 6, 'Choice of Bread', 'Butter Naan (2 pcs)', 50.00, 0),
(6, 6, 'Choice of Bread', 'Garlic Naan (2 pcs)', 60.00, 0),
(7, 14, 'Crust Type', 'Traditional Napoletana Thick Crust', 0.00, 1),
(8, 14, 'Crust Type', 'Thin & Crisp Romano Crust', 20.00, 0),
(9, 14, 'Cheese Add-on', 'Double Burrata Cheese', 80.00, 0),
(10, 22, 'Protein Add-on', 'Extra Grilled Tofu Skewer', 50.00, 0),
(11, 22, 'Dressing', 'Lemon Herb Tahini (Default)', 0.00, 1),
(12, 22, 'Dressing', 'Spicy Jalapeno Vinaigrette', 15.00, 0);

-- ----------------------------------------------------------------------------
-- 9. COUPONS
-- ----------------------------------------------------------------------------
INSERT INTO `coupons` (`id`, `code`, `title`, `description`, `discount_type`, `discount_value`, `min_order_amount`, `max_discount_amount`, `valid_from`, `valid_to`, `usage_limit`, `times_used`, `is_active`) VALUES
(1, 'FOODIE50', 'Flat 50% Off Welcome Treat', 'Get 50% discount up to ₹150 on your delicious culinary adventures', 'percentage', 50.00, 200.00, 150.00, '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1000, 4, 1),
(2, 'WELCOME100', 'Flat ₹100 Off', 'Enjoy an instant flat ₹100 discount on orders above ₹350', 'fixed', 100.00, 350.00, 100.00, '2026-01-01 00:00:00', '2027-12-31 23:59:59', 500, 2, 1),
(3, 'TASTY20', '20% Savings Fiesta', 'Save 20% up to ₹100 on all multi-cuisine orders', 'percentage', 20.00, 150.00, 100.00, '2026-01-01 00:00:00', '2027-12-31 23:59:59', 500, 1, 1);

-- ----------------------------------------------------------------------------
-- 10. ORDERS
-- ----------------------------------------------------------------------------
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `restaurant_id`, `address_id`, `delivery_address_text`, `phone`, `status`, `subtotal`, `tax_amount`, `delivery_fee`, `discount_amount`, `total_amount`, `coupon_code`, `payment_method`, `payment_status`, `customer_notes`, `created_at`) VALUES
(1, 'ORD-20260910-1001', 3, 1, 1, 'Flat 4B, Emerald Residency, 12 Burkit Road, T. Nagar, Chennai - 600017', '+91 9884019283', 'delivered', 570.00, 28.50, 35.00, 150.00, 483.50, 'FOODIE50', 'demo_upi', 'paid', 'Please ring the doorbell and leave at door.', '2026-09-10 13:15:00'),
(2, 'ORD-20260912-1002', 4, 2, 3, 'House 24, 2nd Avenue, Shanthi Colony, Anna Nagar, Chennai - 600040', '+91 9791029384', 'delivered', 225.00, 11.25, 25.00, 45.00, 216.25, 'TASTY20', 'demo_card', 'paid', 'Keep chutney fresh and spicy.', '2026-09-12 19:40:00'),
(3, 'ORD-20260915-1003', 3, 3, 2, 'DLF CyberCity, Block 7, 3rd Floor, Manapakkam, Chennai - 600089', '+91 9884019283', 'delivered', 700.00, 35.00, 45.00, 100.00, 680.00, 'WELCOME100', 'demo_upi', 'paid', 'Deliver to security desk.', '2026-09-15 12:45:00'),
(4, 'ORD-20260918-1004', 4, 1, 3, 'House 24, 2nd Avenue, Shanthi Colony, Anna Nagar, Chennai - 600040', '+91 9791029384', 'preparing', 320.00, 16.00, 35.00, 0.00, 371.00, NULL, 'demo_upi', 'paid', 'Send extra raita if possible.', '2026-09-18 20:10:00'),
(5, 'ORD-20260919-1005', 3, 4, 1, 'Flat 4B, Emerald Residency, 12 Burkit Road, T. Nagar, Chennai - 600017', '+91 9884019283', 'out_for_delivery', 420.00, 21.00, 30.00, 100.00, 371.00, 'WELCOME100', 'demo_card', 'paid', 'Call on arrival.', '2026-09-19 19:30:00');

-- ----------------------------------------------------------------------------
-- 11. ORDER_ITEMS (Snapshots)
-- ----------------------------------------------------------------------------
INSERT INTO `order_items` (`id`, `order_id`, `menu_item_id`, `item_name`, `unit_price`, `quantity`, `subtotal`, `customization_notes`) VALUES
(1, 1, 1, 'Murg Malai Tikka', 250.00, 1, 250.00, 'Well roasted'),
(2, 1, 3, 'Royal Hyderabadi Chicken Dum Biryani', 290.00, 1, 290.00, 'Extra salan'),
(3, 1, 8, 'Shahi Tukda with Rabri', 30.00, 1, 30.00, 'Chilled'),
(4, 2, 9, 'Classic Ghee Roast Masala Dosa', 110.00, 1, 110.00, 'Extra crispy'),
(5, 2, 10, 'Mylapore Podi Idli (4 pcs)', 95.00, 1, 95.00, 'Ghee podi'),
(6, 2, 13, 'Traditional Kumbakonam Degree Coffee', 20.00, 1, 20.00, 'Strong'),
(7, 3, 14, 'Margherita Burrata Pizza', 340.00, 1, 340.00, 'Fresh basil'),
(8, 3, 16, 'Truffle Mushroom Fettuccine', 360.00, 1, 360.00, 'Extra cheese'),
(9, 4, 3, 'Royal Hyderabadi Chicken Dum Biryani', 320.00, 1, 320.00, 'Mild spicy'),
(10, 5, 18, 'Crystal Veg Dim Sum (6 pcs)', 190.00, 1, 190.00, 'Spicy dip'),
(11, 5, 21, 'Schezwan Fiery Chicken Rice', 230.00, 1, 230.00, 'Hot');

-- ----------------------------------------------------------------------------
-- 12. ORDER_STATUS_HISTORY
-- ----------------------------------------------------------------------------
INSERT INTO `order_status_history` (`order_id`, `previous_status`, `new_status`, `changed_by_user_id`, `notes`, `changed_at`) VALUES
(1, 'placed', 'confirmed', 1, 'Order accepted by kitchen', '2026-09-10 13:16:00'),
(1, 'confirmed', 'preparing', 1, 'Dum cooking in progress', '2026-09-10 13:20:00'),
(1, 'preparing', 'out_for_delivery', 1, 'Handed to courier', '2026-09-10 13:40:00'),
(1, 'out_for_delivery', 'delivered', 1, 'Successfully received by customer', '2026-09-10 13:58:00'),
(4, 'placed', 'confirmed', 1, 'Confirmed', '2026-09-18 20:11:00'),
(4, 'confirmed', 'preparing', 1, 'In preparation', '2026-09-18 20:15:00'),
(5, 'placed', 'confirmed', 1, 'Accepted', '2026-09-19 19:32:00'),
(5, 'confirmed', 'preparing', 1, 'Wok stir fry ongoing', '2026-09-19 19:38:00'),
(5, 'preparing', 'out_for_delivery', 1, 'Rider on bike', '2026-09-19 19:50:00');

-- ----------------------------------------------------------------------------
-- 13. COUPON_REDEMPTIONS
-- ----------------------------------------------------------------------------
INSERT INTO `coupon_redemptions` (`id`, `coupon_id`, `user_id`, `order_id`, `discount_applied`, `redeemed_at`) VALUES
(1, 1, 3, 1, 150.00, '2026-09-10 13:15:00'),
(2, 3, 4, 2, 45.00, '2026-09-12 19:40:00'),
(3, 2, 3, 3, 100.00, '2026-09-15 12:45:00'),
(4, 2, 3, 5, 100.00, '2026-09-19 19:30:00');

-- ----------------------------------------------------------------------------
-- 14. PAYMENTS
-- ----------------------------------------------------------------------------
INSERT INTO `payments` (`id`, `order_id`, `transaction_ref`, `payment_method`, `amount`, `currency`, `status`, `payment_gateway_response`, `created_at`) VALUES
(1, 1, 'TXN-UPI-992817261', 'demo_upi', 483.50, 'INR', 'completed', '{"status":"SUCCESS","rrn":"284729184729"}', '2026-09-10 13:15:00'),
(2, 2, 'TXN-CARD-448102938', 'demo_card', 216.25, 'INR', 'completed', '{"status":"SUCCESS","authCode":"918234"}', '2026-09-12 19:40:00'),
(3, 3, 'TXN-UPI-771829304', 'demo_upi', 680.00, 'INR', 'completed', '{"status":"SUCCESS","rrn":"482019283741"}', '2026-09-15 12:45:00'),
(4, 4, 'TXN-UPI-558291039', 'demo_upi', 371.00, 'INR', 'completed', '{"status":"SUCCESS","rrn":"592810392817"}', '2026-09-18 20:10:00'),
(5, 5, 'TXN-CARD-119283746', 'demo_card', 371.00, 'INR', 'completed', '{"status":"SUCCESS","authCode":"339182"}', '2026-09-19 19:30:00');

-- ----------------------------------------------------------------------------
-- 15. RESERVATIONS
-- ----------------------------------------------------------------------------
INSERT INTO `reservations` (`id`, `reservation_code`, `user_id`, `restaurant_id`, `table_id`, `reservation_date`, `reservation_time`, `party_size`, `status`, `special_requests`, `created_at`) VALUES
(1, 'RES-20260920-001', 3, 1, 2, '2026-09-20', '19:30:00', 4, 'completed', 'Window booth if possible. Birthday celebration.', '2026-09-16 11:00:00'),
(2, 'RES-20260922-002', 4, 3, 17, '2026-09-22', '20:00:00', 2, 'completed', 'Quiet candlelit table for anniversary dinner.', '2026-09-17 15:30:00'),
(3, 'RES-20261025-003', 3, 1, 7, '2026-10-25', '20:00:00', 4, 'confirmed', 'Rooftop table preferred for cool evening breeze.', '2026-10-18 10:20:00'),
(4, 'RES-20261026-004', 4, 5, 24, '2026-10-26', '13:00:00', 3, 'confirmed', 'Vegan birthday lunch.', '2026-10-19 09:15:00'),
(5, 'RES-20261028-005', 3, 2, 12, '2026-10-28', '19:00:00', 4, 'pending', 'Family gathering.', '2026-10-20 18:00:00');

-- ----------------------------------------------------------------------------
-- 16. RESERVATION_STATUS_HISTORY
-- ----------------------------------------------------------------------------
INSERT INTO `reservation_status_history` (`reservation_id`, `previous_status`, `new_status`, `changed_by_user_id`, `notes`, `changed_at`) VALUES
(1, 'pending', 'confirmed', 1, 'Host confirmed table allocation', '2026-09-16 11:30:00'),
(1, 'confirmed', 'completed', 1, 'Guests arrived and dined', '2026-09-20 21:30:00'),
(2, 'pending', 'confirmed', 1, 'Confirmed by maitre d', '2026-09-17 16:00:00'),
(2, 'confirmed', 'completed', 1, 'Dining completed', '2026-09-22 22:00:00'),
(3, 'pending', 'confirmed', 1, 'Rooftop allocated', '2026-10-18 10:45:00'),
(4, 'pending', 'confirmed', 1, 'Booth 2 reserved', '2026-10-19 09:30:00');

-- ----------------------------------------------------------------------------
-- 17. REVIEWS
-- ----------------------------------------------------------------------------
INSERT INTO `reviews` (`id`, `user_id`, `restaurant_id`, `order_id`, `rating`, `comment`, `created_at`) VALUES
(1, 3, 1, 1, 5, 'The Royal Biryani House never disappoints! The meat was exceptionally tender and the saffron aroma filled the entire dining room.', '2026-09-10 15:00:00'),
(2, 4, 2, 2, 5, 'Crispy Ghee Roast Dosa with their coconut and tomato chutneys is pure nostalgia. Highly recommended!', '2026-09-12 21:00:00'),
(3, 3, 3, 3, 4, 'Delicious wood-fired pizza with authentic creamy burrata. Fast delivery too!', '2026-09-15 14:00:00'),
(4, 4, 1, 4, 5, 'Best dum biryani in Chennai without question. The portion size and raita quality are unmatched.', '2026-09-19 10:00:00');

-- ----------------------------------------------------------------------------
-- 18. FAVORITES
-- ----------------------------------------------------------------------------
INSERT INTO `favorites` (`id`, `user_id`, `restaurant_id`, `created_at`) VALUES
(1, 3, 1, '2026-09-05 10:00:00'),
(2, 3, 3, '2026-09-08 12:00:00'),
(3, 4, 2, '2026-09-06 14:00:00'),
(4, 4, 5, '2026-09-10 11:00:00');

-- ----------------------------------------------------------------------------
-- 19. DELIVERY_ASSIGNMENTS
-- ----------------------------------------------------------------------------
INSERT INTO `delivery_assignments` (`id`, `order_id`, `driver_name`, `driver_phone`, `vehicle_number`, `status`, `assigned_at`, `picked_up_at`, `delivered_at`) VALUES
(1, 1, 'Karthik Raja', '+91 9841029381', 'TN-07-CB-4910', 'delivered', '2026-09-10 13:30:00', '2026-09-10 13:40:00', '2026-09-10 13:58:00'),
(2, 2, 'Murugan Velu', '+91 9789012345', 'TN-09-AX-8812', 'delivered', '2026-09-12 19:45:00', '2026-09-12 19:55:00', '2026-09-12 20:15:00'),
(3, 3, 'Manoj Kumar', '+91 9940128374', 'TN-02-BM-1928', 'delivered', '2026-09-15 13:00:00', '2026-09-15 13:12:00', '2026-09-15 13:35:00'),
(4, 5, 'Praveen Das', '+91 9840291823', 'TN-10-DE-5541', 'picked_up', '2026-09-19 19:40:00', '2026-09-19 19:50:00', NULL);

-- ----------------------------------------------------------------------------
-- 20. NOTIFICATIONS
-- ----------------------------------------------------------------------------
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `reference_id`, `is_read`, `created_at`) VALUES
(1, 3, 'Order Delivered!', 'Your order ORD-20260910-1001 from The Royal Biryani House has been delivered. Enjoy your meal!', 'order', 1, 1, '2026-09-10 13:58:00'),
(2, 3, 'Table Reservation Confirmed', 'Your table for 4 at The Royal Biryani House on 25th October at 8:00 PM is confirmed. Code: RES-20261025-003.', 'reservation', 3, 0, '2026-10-18 10:45:00'),
(3, 4, 'Special Welcome Promo!', 'Use code FOODIE50 to enjoy 50% discount on your favorite cuisines today!', 'promo', NULL, 1, '2026-09-05 09:00:00'),
(4, 4, 'Order in Kitchen', 'The Royal Biryani House is preparing your order ORD-20260918-1004 fresh from the charcoal tandoor.', 'order', 4, 0, '2026-09-18 20:15:00');

-- ----------------------------------------------------------------------------
-- 21. AUDIT_LOGS
-- ----------------------------------------------------------------------------
INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `details`, `ip_address`, `created_at`) VALUES
(1, 1, 'SYSTEM_INIT', 'database', NULL, '{"event":"Seed data and initial schema loaded successfully"}', '127.0.0.1', '2026-09-01 10:00:00'),
(2, 1, 'CREATE_RESTAURANT', 'restaurants', 1, '{"name":"The Royal Biryani House","cuisine":"Biryani & Mughlai"}', '127.0.0.1', '2026-09-01 12:00:00'),
(3, 1, 'CREATE_COUPON', 'coupons', 1, '{"code":"FOODIE50","discount_value":50.00}', '127.0.0.1', '2026-09-01 14:00:00'),
(4, 3, 'CHECKOUT_SUCCESS', 'orders', 1, '{"order_number":"ORD-20260910-1001","total":483.50}', '192.168.1.15', '2026-09-10 13:15:00');
