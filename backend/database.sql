CREATE DATABASE IF NOT EXISTS mech_db;
USE mech_db;

CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
-- In a real app the hash would be used, but for simplicity here's a plain password as requested by original app flow
INSERT IGNORE INTO admin_users (username, password_hash, role) VALUES ('admin', 'admin123', 'admin');

CREATE TABLE IF NOT EXISTS mechanics (
    id VARCHAR(50) PRIMARY KEY, /* using string ID for uuid compatibility with old base44 */
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    shop_name VARCHAR(150),
    address TEXT,
    city VARCHAR(100),
    pin_code VARCHAR(20),
    profile_photo TEXT,
    shop_photos TEXT, -- JSON string array
    specialties TEXT, -- JSON string array
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    payment_status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, paid
    is_active BOOLEAN DEFAULT FALSE,
    average_rating DECIMAL(3, 1) DEFAULT 0.0,
    total_reviews INT DEFAULT 0,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(50) PRIMARY KEY,
    mechanic_id VARCHAR(50) NOT NULL,
    reviewer_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mechanic_id) REFERENCES mechanics(id) ON DELETE CASCADE
);
