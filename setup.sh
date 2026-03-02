#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up Kyndex project...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠ Docker is not installed. You will need Docker to run the database.${NC}"
fi

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    exit 1
fi

# Create backend .env file
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created backend/.env.local${NC}"
fi

cd ..

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi

# Create frontend .env file
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created frontend/.env.local${NC}"
fi

cd ..

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Start Docker containers: docker-compose up -d"
echo "2. Run database migrations: cd backend && npm run db:migrate"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm run dev"
echo "5. Open http://localhost:3001 in your browser"
