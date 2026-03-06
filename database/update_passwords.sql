USE terrain_reservation;
UPDATE users SET password='$2a$10$FK0Cgdv2MUAwo5B7OuUor.mnqFHDxULU25M/y9yZ9LV4Ak/l3d14e' WHERE email='joueur@test.com';
UPDATE users SET password='$2a$10$FK0Cgdv2MUAwo5B7OuUor.mnqFHDxULU25M/y9yZ9LV4Ak/l3d14e' WHERE email='president@test.com';
UPDATE users SET password='$2a$10$FK0Cgdv2MUAwo5B7OuUor.mnqFHDxULU25M/y9yZ9LV4Ak/l3d14e' WHERE email='admin@test.com';
SELECT email, role FROM users;
