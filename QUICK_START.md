# Guide de démarrage rapide — TerrainPro

## Prérequis

| Outil | Version | Lien |
|-------|---------|------|
| Node.js | 18+ | https://nodejs.org |
| Java | 17+ | https://adoptopenjdk.net |
| Maven | 3.8+ | https://maven.apache.org |
| MySQL | 8.0+ | https://mysql.com |

---

## Étape 1 — Configurer la base de données

### Créer la base (première fois uniquement)

```bash
mysql -u root -p < database/init_database.sql
```

### Modifier le mot de passe dans `backend/src/main/resources/application.properties`

```properties
spring.datasource.password=VOTRE_MOT_DE_PASSE_MYSQL   ← remplacez cette ligne
```

---

## Étape 2 — Démarrer le backend

```bash
cd backend
mvn spring-boot:run
```

✅ API disponible sur `http://localhost:8080/api`

---

## Étape 3 — Démarrer le frontend

Dans un **nouveau terminal** :

```bash
cd frontend
npm install      # première fois uniquement
npm run dev
```

✅ Application sur `http://localhost:5173`

---

## Démarrage automatique (Windows)

Double-cliquez sur `start-all.bat`

---

## Comptes de test

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| joueur@test.com | password | Joueur |
| president@test.com | password | Président |
| admin@test.com | admin | Administrateur |

---

## Problèmes courants

### Port 8080 déjà utilisé
Changez `server.port` dans `application.properties`.

### Erreur "Access denied for user root"
Vérifiez `spring.datasource.password` dans `application.properties`.

### Table inexistante
Exécutez `database/init_database.sql` dans MySQL.

### Page blanche sur localhost:5173
Vérifiez que le backend tourne bien sur le port 8080.

---

## Architecture

```
SAAS_Terrain/
├── frontend/          React + Vite + Tailwind CSS (port 5173)
│   └── src/
│       ├── pages/     Home, Terrains, Login, Register, ...
│       ├── components/ Navbar, Footer
│       ├── store/     Zustand (auth)
│       └── api/       Axios (proxy → :8080)
├── backend/           Spring Boot + MySQL (port 8080)
│   └── src/main/java/
│       ├── controller/ REST endpoints
│       ├── service/    Business logic
│       └── entity/     JPA entities
└── database/
    └── init_database.sql
```
