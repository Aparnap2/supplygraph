#!/bin/bash

# SupplyGraph Deployment Script
# This script sets up and runs the complete SupplyGraph platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 SupplyGraph Deployment Script${NC}"
echo -e "${YELLOW}=================================${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file from template...${NC}"
    cp apps/ai-engine/.env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your API keys and configuration${NC}"
fi

# Function to start services
start_services() {
    echo -e "${GREEN}🏗️  Building and starting services...${NC}"

    # Build and start database first
    echo -e "${BLUE}📦 Starting PostgreSQL...${NC}"
    docker-compose -f docker-compose.sidecar.yml up -d postgres

    # Wait for PostgreSQL to be ready
    echo -e "${BLUE}⏳ Waiting for PostgreSQL to be ready...${NC}"
    until docker-compose -f docker-compose.sidecar.yml exec postgres pg_isready -U supplygraph; do
        echo -n "."
        sleep 2
    done
    echo -e " ${GREEN}✅ PostgreSQL is ready!${NC}"

    # Start Valkey/Redis
    echo -e "${BLUE}📦 Starting Valkey/Redis...${NC}"
    docker-compose -f docker-compose.sidecar.yml up -d valkey

    # Wait for Valkey to be ready
    echo -e "${BLUE}⏳ Waiting for Valkey to be ready...${NC}"
    until docker-compose -f docker-compose.sidecar.yml exec valkey redis-cli ping; do
        echo -n "."
        sleep 2
    done
    echo -e " ${GREEN}✅ Valkey is ready!${NC}"

    # Run database migrations
    echo -e "${BLUE}🗄️ Running database migrations...${NC}"
    cd packages/database
    npx prisma migrate deploy
    cd ../..

    # Start remaining services
    echo -e "${BLUE}📦 Starting AI Engine and Web services...${NC}"
    docker-compose -f docker-compose.sidecar.yml up -d celery-worker ai-engine web

    # Wait for services to be healthy
    echo -e "${BLUE}⏳ Waiting for services to be healthy...${NC}"
    sleep 10

    # Check service health
    if docker-compose -f docker-compose.sidecar.yml ps | grep -q "Up"; then
        echo -e "${GREEN}✅ Services are running!${NC}"
    else
        echo -e "${RED}❌ Some services failed to start. Check logs with: docker-compose -f docker-compose.sidecar.yml logs${NC}"
        exit 1
    fi
}

# Function to stop services
stop_services() {
    echo -e "${YELLOW}🛑 Stopping services...${NC}"
    docker-compose -f docker-compose.sidecar.yml down
    echo -e "${GREEN}✅ Services stopped.${NC}"
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📋 Showing logs...${NC}"
    docker-compose -f docker-compose.sidecar.yml logs -f
}

# Function to access services
access_services() {
    echo -e "${GREEN}🌐 Service URLs:${NC}"
    echo -e "${BLUE}  • Frontend: http://localhost:3000${NC}"
    echo -e "${BLUE}  • AI Engine API: http://localhost:8000${NC}"
    echo -e "${BLUE}  • Mailpit (Email Testing): http://localhost:8025${NC}"
    echo -e "${BLUE}  • pgAdmin (Database): http://localhost:5050${NC}"
    echo ""
    echo -e "${GREEN}🔗 API Endpoints:${NC}"
    echo -e "${BLUE}  • Health Check: http://localhost:8000/health${NC}"
    echo -e "${BLUE}  • WebSocket: ws://localhost:8000/ws/<thread_id>${NC}"
    echo ""
}

# Function to reset database
reset_database() {
    echo -e "${YELLOW}⚠️  This will delete all data. Are you sure? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo -e "${RED}🗑️  Resetting database...${NC}"
        docker-compose -f docker-compose.sidecar.yml down
        docker volume rm supplygraph_postgres_data 2>/dev/null || true
        docker-compose -f docker-compose.sidecar.yml up -d postgres
        echo -e "${GREEN}✅ Database reset complete.${NC}"
    else
        echo -e "${GREEN}✅ Database reset cancelled.${NC}"
    fi
}

# Function to run tests
run_tests() {
    echo -e "${BLUE}🧪 Running tests...${NC}"

    # Backend tests
    echo -e "${BLUE}Running backend tests...${NC}"
    docker-compose -f docker-compose.sidecar.yml exec ai-engine python -m pytest tests/ -v

    # Frontend tests
    echo -e "${BLUE}Running frontend tests...${NC}"
    docker-compose -f docker-compose.sidecar.yml exec web npm test
}

# Main menu
case "$1" in
    start|up)
        start_services
        access_services
        ;;
    stop|down)
        stop_services
        ;;
    restart)
        stop_services
        sleep 2
        start_services
        access_services
        ;;
    logs)
        show_logs
        ;;
    access)
        access_services
        ;;
    reset-db)
        reset_database
        ;;
    test)
        run_tests
        ;;
    *)
        echo -e "${GREEN}SupplyGraph Deployment Script${NC}"
        echo -e "${YELLOW}Usage:${NC}"
        echo "  $0 [command]"
        echo ""
        echo -e "${YELLOW}Commands:${NC}"
        echo "  start, up    - Start all services"
        echo "  stop, down    - Stop all services"
        echo "  restart      - Restart all services"
        echo "  logs         - Show logs for all services"
        echo "  access      - Show service URLs"
        echo "  reset-db     - Reset database (deletes all data)"
        echo "  test         - Run tests"
        echo ""
        exit 1
        ;;
esac