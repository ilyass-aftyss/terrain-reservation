# README - Base de Données MySQL

## Installation

### 1. Créer la base de données
```bash
mysql -u root -p < init_database.sql
```

Ou se connecter à MySQL et exécuter le script manuellement:
```bash
mysql -u root -p
```

Puis copier-coller le contenu du fichier `init_database.sql`

### 2. Configuration

**Utilisateur MySQL par défaut**:
- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: `root` (à changer en production)
- Database: `terrain_reservation`

**À modifier dans `backend/src/main/resources/application.properties`**:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/terrain_reservation
spring.datasource.username=root
spring.datasource.password=root
```

## Structure des Tables

### users
- Utilisateurs du système (JOUEUR, PRESIDENT, ADMIN)
- Stocke email, password, profil utilisateur

### terrains
- Terrains disponibles à la réservation
- Liés à un PRESIDENT
- Supporte 5x5 et 7x7 avec prix différents

### reservations
- Réservations de terrains
- Statut: PENDING, CONFIRMED, PAID, COMPLETED, CANCELLED
- Générez PDF et QR code

### payments
- Historique des paiements
- Suivi des transactions

### terrain_availability
- Gestion des créneaux disponibles
- Vérification des conflits d'horaires

### reviews
- Évaluations des terrains par les utilisateurs

## Commandes Utiles

```bash
# Afficher toutes les bases de données
SHOW DATABASES;

# Utiliser la base de données
USE terrain_reservation;

# Afficher toutes les tables
SHOW TABLES;

# Voir la structure d'une table
DESCRIBE users;

# Compter les enregistrements
SELECT COUNT(*) FROM users;

# Exporter un backup
mysqldump -u root -p terrain_reservation > backup.sql

# Importer un backup
mysql -u root -p terrain_reservation < backup.sql
```

## Maintenance

### Créer un utilisateur MySQL dédié (Recommandé en Production)
```sql
CREATE USER 'terrain_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON terrain_reservation.* TO 'terrain_user'@'localhost';
FLUSH PRIVILEGES;
```

### Vérifier l'intégrité des données
```sql
-- Vérifier les réservations sans utilisateur valide
SELECT r.* FROM reservations r 
WHERE r.user_id NOT IN (SELECT id FROM users);

-- Vérifier les terrains sans président valide
SELECT t.* FROM terrains t 
WHERE t.president_id NOT IN (SELECT id FROM users WHERE role = 'PRESIDENT');
```
