-- JalAshray Database Setup for Raipur Region
-- Run this SQL script to create the database and seed Raipur-specific data

-- Create database
CREATE DATABASE IF NOT EXISTS jalashray
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE jalashray;

-- Drop existing tables if you want a clean setup (optional - uncomment if needed)
-- DROP TABLE IF EXISTS repairs;
-- DROP TABLE IF EXISTS leaks;
-- DROP TABLE IF EXISTS users;

-- Users table (supports different roles: admin, worker, citizen)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'worker', 'citizen') DEFAULT 'citizen',
  department VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- Leaks table
CREATE TABLE IF NOT EXISTS leaks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  severity ENUM('critical', 'high', 'medium', 'low') NOT NULL,
  status ENUM('active', 'in_progress', 'resolved') DEFAULT 'active',
  description TEXT,
  reported_by VARCHAR(255),
  photo_url VARCHAR(255),
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_leaks_status (status),
  INDEX idx_leaks_severity (severity),
  INDEX idx_leaks_reported_at (reported_at)
) ENGINE=InnoDB;

-- Repairs table
CREATE TABLE IF NOT EXISTS repairs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  leak_id INT NOT NULL,
  worker_id INT,
  status ENUM('assigned', 'in_progress', 'completed') DEFAULT 'assigned',
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  before_photo VARCHAR(255),
  after_photo VARCHAR(255),
  FOREIGN KEY (leak_id) REFERENCES leaks(id) ON DELETE CASCADE,
  FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_repairs_status (status),
  INDEX idx_repairs_leak_id (leak_id),
  INDEX idx_repairs_worker_id (worker_id)
) ENGINE=InnoDB;

-- Seed test users (passwords will be hashed by the application)
-- Note: These are plaintext for initial setup - the app will hash them on first login
INSERT INTO users (name, email, password, role, department) VALUES
('Test Worker', 'worker@test.com', 'password123', 'worker', 'Raipur Water Board'),
('Test Admin', 'admin@test.com', 'admin123', 'admin', 'Raipur Water Management')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  department = VALUES(department);

-- Clear existing leaks/repairs for fresh data
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM repairs;
DELETE FROM leaks;
SET FOREIGN_KEY_CHECKS = 1;

-- Seed Raipur region leaks
INSERT INTO leaks (location, latitude, longitude, severity, status, description, reported_by) VALUES
('Pandri, Raipur', 21.2380, 81.6337, 'critical', 'active', 'Major pipeline burst causing road flooding near city center', 'Citizen Report'),
('Telibandha, Raipur', 21.2470, 81.6414, 'high', 'in_progress', 'Water leak near Telibandha Talab detected by IoT sensors', 'IoT Sensor #12'),
('Civil Lines, Raipur', 21.2350, 81.6280, 'medium', 'resolved', 'Small leak at government office area fixed successfully', 'Worker #45'),
('Shankar Nagar, Raipur', 21.2513, 81.6296, 'high', 'active', 'Underground pipe leak causing water wastage in residential area', 'IoT Sensor #23'),
('Devendra Nagar, Raipur', 21.2400, 81.6500, 'low', 'in_progress', 'Minor dripping from junction point near market', 'Citizen Report'),
('G.E. Road, Raipur', 21.2450, 81.6150, 'critical', 'active', 'Major leak on main highway affecting traffic', 'IoT Sensor #15'),
('Tatibandh, Raipur', 21.2100, 81.6800, 'medium', 'in_progress', 'Pipeline crack detected near residential colony', 'Worker #67'),
('Naya Raipur', 21.1650, 81.7753, 'high', 'active', 'New capital area pipeline showing pressure drops', 'IoT Sensor #08'),
('Mowa, Raipur', 21.2600, 81.6400, 'low', 'resolved', 'Small leak near industrial area fixed today', 'Worker #34'),
('VIP Road, Raipur', 21.2520, 81.6380, 'medium', 'active', 'Suspected leak near commercial complex requiring inspection', 'Citizen Report');

-- Verification queries
SELECT 'Users' as TableName, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Leaks', COUNT(*) FROM leaks
UNION ALL
SELECT 'Repairs', COUNT(*) FROM repairs;

-- View sample data
SELECT id, name, email, role, department FROM users;
SELECT id, location, severity, status, reported_at FROM leaks ORDER BY reported_at DESC LIMIT 5;

