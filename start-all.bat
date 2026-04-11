@echo off
chcp 65001 >nul 2>nul

echo.
echo =========================================================
echo   TERRAIN RESERVATION - Application SaaS
echo   Football Field Reservation System (5x5 / 7x7)
echo =========================================================
echo.

echo [1/4] Verification des prerequis...
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe
    echo Telechargez-le sur: https://nodejs.org
    pause & exit /b 1
)
echo OK - Node.js trouve

where java >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: Java n'est pas installe
    echo Telechargez-le sur: https://adoptopenjdk.net
    pause & exit /b 1
)
echo OK - Java trouve

where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: Maven n'est pas installe
    echo Telechargez-le sur: https://maven.apache.org
    pause & exit /b 1
)
echo OK - Maven trouve

echo.
echo [2/4] Configuration de la base de donnees...
echo.
echo IMPORTANT: Avant de continuer, assurez-vous d'avoir :
echo   1. MySQL en cours d'execution (port 3306)
echo   2. Modifie le mot de passe dans:
echo      backend\src\main\resources\application.properties
echo      (remplacez VOTRE_MOT_DE_PASSE_MYSQL par votre vrai mot de passe)
echo.
echo   Pour creer la base de donnees (premiere fois uniquement):
echo   mysql -u root -p ^< database\init_database.sql
echo.
echo Appuyez sur une touche quand tout est pret...
pause >nul

echo.
echo [3/4] Installation des dependances...
echo.

cd frontend
if exist node_modules (
    echo OK - node_modules deja installe
) else (
    echo Installation npm en cours...
    call npm install
    if %errorlevel% neq 0 ( echo ERREUR npm install & pause & exit /b 1 )
)
cd ..
echo OK - Frontend pret

cd backend
echo Compilation Maven en cours...
call mvn clean install -q -DskipTests
if %errorlevel% neq 0 ( echo ERREUR Maven & pause & exit /b 1 )
cd ..
echo OK - Backend compile

echo.
echo [4/4] Demarrage des services...
echo.
echo =========================================================
echo   Backend   -^> http://localhost:8080/api
echo   Frontend  -^> http://localhost:5173
echo   Database  -^> localhost:3306 / terrain_reservation
echo =========================================================
echo.

echo Lancement du Backend Spring Boot...
cd backend
start "TerrainPro - Backend (8080)" cmd /k "mvn spring-boot:run"
cd ..

timeout /t 5 /nobreak >nul

echo Lancement du Frontend React...
cd frontend
start "TerrainPro - Frontend (5173)" cmd /k "npm run dev"
cd ..

echo.
echo =========================================================
echo   TOUS LES SERVICES SONT DEMARRES
echo.
echo   Ouvrez votre navigateur sur:
echo   http://localhost:5173
echo.
echo   Comptes de test:
echo   - joueur@test.com     / password
echo   - president@test.com  / password
echo   - admin@test.com      / admin
echo =========================================================
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul
