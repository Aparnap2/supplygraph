#!/bin/bash
# Development script for SupplyGraph - starts both web and AI services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."

    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed. Please install pnpm first."
        exit 1
    fi

    if ! command -v uv &> /dev/null; then
        print_error "uv is not installed. Please install uv for Python dependency management."
        exit 1
    fi

    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed."
        exit 1
    fi

    print_success "All dependencies are installed!"
}

# Check if Docker is running (optional)
check_docker() {
    if command -v docker &> /dev/null; then
        if docker info &> /dev/null; then
            print_status "Docker is running"
            return 0
        fi
    fi
    print_warning "Docker is not running. Database and Redis might not be available."
    return 1
}

# Function to start services
start_services() {
    local mode=${1:-"both"}

    print_status "Starting services in mode: $mode"

    case $mode in
        "web")
            print_status "Starting web service only..."
            cd apps/web
            pnpm dev
            ;;
        "ai")
            print_status "Starting AI engine only..."
            cd apps/ai-engine
            PYTHONPATH=. uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
            ;;
        "both")
            print_status "Starting both web and AI services..."

            # Start AI engine in background
            cd apps/ai-engine
            PYTHONPATH=. uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000 &
            AI_PID=$!
            cd ../../

            # Wait a moment for AI engine to start
            sleep 2

            # Start web service
            cd apps/web
            pnpm dev &
            WEB_PID=$!
            cd ../../

            print_success "Services started!"
            print_status "Web: http://localhost:3000"
            print_status "AI Engine: http://localhost:8000"
            print_status "API Docs: http://localhost:8000/docs"

            # Wait for both processes
            trap "kill $AI_PID $WEB_PID 2>/dev/null" EXIT
            wait $AI_PID $WEB_PID
            ;;
        *)
            print_error "Invalid mode. Use: web, ai, or both"
            exit 1
            ;;
    esac
}

# Main script
main() {
    echo "SupplyGraph Development Server"
    echo "=============================="

    # Parse command line arguments
    MODE="both"
    SKIP_DEPS=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --mode)
                MODE="$2"
                shift 2
                ;;
            --skip-deps)
                SKIP_DEPS=true
                shift
                ;;
            --help|-h)
                echo "Usage: $0 [options]"
                echo ""
                echo "Options:"
                echo "  --mode MODE     Service mode: web, ai, or both (default: both)"
                echo "  --skip-deps     Skip dependency check"
                echo "  --help, -h      Show this help message"
                echo ""
                echo "Examples:"
                echo "  $0                # Start both services"
                echo "  $0 --mode web     # Start only web service"
                echo "  $0 --mode ai      # Start only AI engine"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    # Check dependencies
    if [ "$SKIP_DEPS" = false ]; then
        check_dependencies
        check_docker
    fi

    # Start services
    start_services "$MODE"
}

# Run main function with all arguments
main "$@"