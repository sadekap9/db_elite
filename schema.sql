-- ============================================================
-- Dubai's Boutique ELITE - MySQL Database Schema & Seed Data
-- Database Name: dubai_boutique_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS dubai_boutique_db;
USE dubai_boutique_db;

-- ------------------------------------------------------------
-- Table: admins
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: customers
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    status VARCHAR(100) DEFAULT 'Almost Elite', -- Milestone tier enum: 'Elite Circle VIP', 'Gold VIP Member', 'Almost Elite', 'Silver VIP Member'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: purchases (Dress Purchases)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    dress_name VARCHAR(255) NOT NULL,
    qty INT DEFAULT 1,
    amount_inr VARCHAR(100) NOT NULL,
    purchase_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: milestone_rules (Custom Target & Date Range Rules)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS milestone_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_months INT NOT NULL,
    target_dresses INT NOT NULL,
    tier_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: message_templates
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS message_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Milestone',
    message_body TEXT NOT NULL,
    variables VARCHAR(255) DEFAULT '{client_name}, {dress_count}, {target_count}',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: boutique_settings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS boutique_settings (
    id INT PRIMARY KEY DEFAULT 1,
    boutique_name VARCHAR(255) DEFAULT "Dubai's Boutique ELITE",
    tagline VARCHAR(255) DEFAULT "More Than Fashion • A Closer Family",
    owner_name VARCHAR(255) DEFAULT "Siddiqa Parveen",
    phone VARCHAR(50) DEFAULT "+91 98765 43210",
    email VARCHAR(255) DEFAULT "siddiqa@dubaiboutique.ae",
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED INITIAL DATA
-- ============================================================

-- Insert Admin (Login: Phone: 9510448090 / Password: Admin@123)
INSERT INTO admins (id, name, phone, password)
VALUES (
    1,
    'Siddiqa Parveen',
    '9510448090',
    'Admin@123'
) ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Initial Boutique Settings
INSERT INTO boutique_settings (id, boutique_name, tagline, owner_name, phone, email)
VALUES (
    1,
    "Dubai's Boutique ELITE",
    "More Than Fashion • A Closer Family",
    "Siddiqa Parveen",
    "+91 98765 43210",
    "siddiqa@dubaiboutique.ae"
) ON DUPLICATE KEY UPDATE boutique_name=VALUES(boutique_name);

-- Insert Seed Milestone Target Rules
INSERT INTO milestone_rules (id, start_date, end_date, duration_months, target_dresses, tier_name, description)
VALUES
(1, '2024-01-01', '2024-06-30', 6, 6, 'Gold VIP Member', 'Buy 6 dresses between 2024-01-01 and 2024-06-30 (6 Months) to unlock Gold VIP Member status.'),
(2, '2024-01-01', '2024-12-31', 12, 12, 'Elite Circle VIP', 'Buy 12 dresses between 2024-01-01 and 2024-12-31 (12 Months) to unlock Elite Circle VIP status.')
ON DUPLICATE KEY UPDATE tier_name=VALUES(tier_name);

-- Insert Sample Customers (With Status Badges: Elite, Premium, Almost Elite, Gold, Silver, Bronze)
INSERT INTO customers (id, name, phone, city, email, total_dresses, annual_target, status, joining_date, total_amount_inr)
VALUES 
(1, 'Ayesha Al-Maktoum', '+91 98765 43210', 'Dubai, UAE', 'ayesha@example.com', 11, 12, 'Almost Elite', '2024-01-15', '₹1,65,000'),
(2, 'Sara Al-Hassan', '+91 98123 45678', 'Abu Dhabi, UAE', 'sara@example.com', 10, 12, 'Gold', '2024-03-10', '₹1,45,000'),
(3, 'Fatima Al-Zahra', '+91 97654 32109', 'Sharjah, UAE', 'fatima@example.com', 10, 12, 'Premium', '2023-11-20', '₹1,48,000'),
(4, 'Sheikha Mariam', '+91 98234 56789', 'Dubai, UAE', 'mariam@example.com', 14, 12, 'Elite', '2022-08-14', '₹2,10,000')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Insert Sample Dress Purchases
INSERT INTO dresses (customer_id, dress_name, collection_line, price, purchase_date)
VALUES 
(1, 'Royal Emerald Velvet Abaya', 'Royal Velvet Line', 4850.00, '2024-02-14'),
(1, 'Golden Pearl Kaftan', 'Haute Couture', 6200.00, '2024-04-10'),
(4, 'Midnight Diamond Gown', 'Elite VIP Line', 12500.00, '2024-01-05');

-- Insert Sample Message Templates
INSERT INTO message_templates (id, title, category, message_body, variables)
VALUES 
(1, '11/12 Milestone VIP Alert', 'Milestone', 'Dear {client_name}, you are just 1 dress purchase away from unlocking Dubai Boutique Elite VIP status! ({dress_count}/{target_count} dresses acquired)', '{client_name}, {dress_count}, {target_count}'),
(2, 'Birthday Royalty Greeting', 'Birthday', 'Wishing you a glorious birthday, {client_name}! We have prepared a special bespoke gift for you at our Dubai Atelier.', '{client_name}'),
(3, 'Haute Couture Exclusive Preview', 'Promotion', 'Dear {client_name}, explore our private new Haute Couture collection launching this weekend.', '{client_name}')
ON DUPLICATE KEY UPDATE title=VALUES(title);
