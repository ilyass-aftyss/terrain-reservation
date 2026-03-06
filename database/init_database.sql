-- Create Database
CREATE DATABASE IF NOT EXISTS terrain_reservation;
USE terrain_reservation;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) UNIQUE,
    role ENUM('JOUEUR', 'PRESIDENT', 'ADMIN') DEFAULT 'JOUEUR' NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Terrains Table
CREATE TABLE IF NOT EXISTS terrains (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    localisation VARCHAR(255) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    president_id BIGINT NOT NULL,
    type_5x5 BOOLEAN DEFAULT TRUE,
    type_7x7 BOOLEAN DEFAULT TRUE,
    prix_5x5 DOUBLE DEFAULT 200.0,
    prix_7x7 DOUBLE DEFAULT 300.0,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (president_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_president_id (president_id),
    INDEX idx_actif (actif),
    INDEX idx_localisation (localisation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    numero_reservation VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    terrain_id BIGINT NOT NULL,
    date_debut DATETIME NOT NULL,
    date_fin DATETIME NOT NULL,
    type ENUM('TYPE_5x5', 'TYPE_7x7') NOT NULL,
    statut ENUM('PENDING', 'CONFIRMED', 'PAID', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING' NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    qr_code LONGTEXT,
    pdf_path TEXT,
    qr_scanned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (terrain_id) REFERENCES terrains(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_terrain_id (terrain_id),
    INDEX idx_statut (statut),
    INDEX idx_date_debut (date_debut),
    UNIQUE KEY uk_numero_reservation (numero_reservation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    reservation_id BIGINT NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    methode VARCHAR(50),
    reference_paiement VARCHAR(255) UNIQUE,
    statut ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING' NOT NULL,
    date_paiement DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_statut (statut),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Availability Table (for managing free/busy slots)
CREATE TABLE IF NOT EXISTS terrain_availability (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    terrain_id BIGINT NOT NULL,
    date_debut DATETIME NOT NULL,
    date_fin DATETIME NOT NULL,
    type ENUM('TYPE_5x5', 'TYPE_7x7') NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (terrain_id) REFERENCES terrains(id) ON DELETE CASCADE,
    INDEX idx_terrain_id (terrain_id),
    INDEX idx_date_debut (date_debut),
    INDEX idx_disponible (disponible)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    terrain_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    note INT CHECK (note >= 1 AND note <= 5),
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (terrain_id) REFERENCES terrains(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_terrain_id (terrain_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Indexes for Performance
CREATE INDEX idx_reservations_date ON reservations(date_debut, date_fin);
CREATE INDEX idx_terrains_creation ON terrains(created_at);
CREATE INDEX idx_reservations_creation ON reservations(created_at);

-- Sample Data (Optional)
-- Password for all test accounts: admin123 (BCrypt hash)
INSERT INTO users (email, password, nom, prenom, telephone, role) VALUES
('joueur@test.com', '$2a$10$ceCIw8rdxCHv9Y5sXgjU8OrxQbXRIxvtnTnd0Jd9UBw3WNeL2gg3e', 'Ahmed', 'Ali', '+212612345678', 'JOUEUR'),
('president@test.com', '$2a$10$ceCIw8rdxCHv9Y5sXgjU8OrxQbXRIxvtnTnd0Jd9UBw3WNeL2gg3e', 'Mohamed', 'Hassan', '+212612345679', 'PRESIDENT'),
('admin@test.com', '$2a$10$ceCIw8rdxCHv9Y5sXgjU8OrxQbXRIxvtnTnd0Jd9UBw3WNeL2gg3e', 'Admin', 'System', '+212612345680', 'ADMIN');

INSERT INTO terrains (nom, description, localisation, latitude, longitude, president_id, type_5x5, type_7x7, prix_5x5, prix_7x7, actif) VALUES
('Terrain El Ahly', 'Terrain moderne avec éclairage', 'Casablanca', 33.5731, -7.5898, 2, TRUE, TRUE, 200, 300, TRUE),
('Terrain El Masry', 'Terrain traditionnel de qualité', 'Rabat', 34.0209, -6.8416, 2, TRUE, FALSE, 150, 0, TRUE),
('Terrain City 5x5', 'Petit terrain bien entretenu', 'Marrakech', 31.6295, -7.9811, 2, TRUE, FALSE, 100, 0, TRUE);
