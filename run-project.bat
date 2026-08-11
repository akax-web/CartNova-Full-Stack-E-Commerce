@echo off
REM ============================================================
REM  CartNova Full-Stack - Windows launcher
REM  Starts the Spring Boot backend and the React frontend, each
REM  in its own terminal window.
REM
REM  IMPORTANT: this assumes you have already:
REM    1. Created the shopping_db database (see root README.md)
REM    2. Configured backend\src\main\resources\application.properties
REM       (or set DB_URL / DB_USERNAME / DB_PASSWORD / JWT_SECRET as
REM       environment variables before running this file)
REM    3. Run "npm install" once inside frontend\ at least one time
REM       (this script does not do a first-time install for you)
REM ============================================================

echo Starting CartNova backend (Spring Boot) on http://localhost:8080 ...
start "CartNova Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Waiting a few seconds before starting the frontend...
timeout /t 8 /nobreak >nul

echo Starting CartNova frontend (Vite) on http://localhost:5173 ...
start "CartNova Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:5173
echo.
echo Close each window individually to stop that server.
pause
