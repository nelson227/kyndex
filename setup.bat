@echo off
REM Colors (Windows batch doesn't support colors natively, so we'll use simple text)
echo.
echo Setting up Kyndex project...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 18+
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Docker is not installed. You will need Docker to run the database.
)
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    exit /b 1
)
echo [OK] Backend dependencies installed
echo.

REM Create backend .env file
if not exist .env.local (
    copy .env.example .env.local
    echo [OK] Created backend\.env.local
)
cd ..
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    exit /b 1
)
echo [OK] Frontend dependencies installed
echo.

REM Create frontend .env file
if not exist .env.local (
    copy .env.example .env.local
    echo [OK] Created frontend\.env.local
)
cd ..
echo.

echo Setup complete!
echo.
echo Next steps:
echo 1. Start Docker containers: docker-compose up -d
echo 2. Run database migrations: cd backend ^&amp; npm run db:migrate
echo 3. Start backend: cd backend ^&amp; npm run dev
echo 4. Start frontend: cd frontend ^&amp; npm run dev
echo 5. Open http://localhost:3001 in your browser
echo.
