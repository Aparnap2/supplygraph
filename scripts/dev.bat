@echo off
REM Development script for SupplyGraph - Windows version
setlocal enabledelayedexpansion

set "MODE=both"
set "SKIP_DEPS=false"

:parse_args
if "%~1"=="" goto :check_deps
if /i "%~1"=="--mode" (
    set "MODE=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--skip-deps" (
    set "SKIP_DEPS=true"
    shift
    goto :parse_args
)
if /i "%~1"=="--help" goto :show_help
if /i "%~1"=="-h" goto :show_help
echo [ERROR] Unknown option: %~1
exit /b 1

:show_help
echo SupplyGraph Development Server
echo ==============================
echo.
echo Usage: %~nx0 [options]
echo.
echo Options:
echo   --mode MODE     Service mode: web, ai, or both (default: both)
echo   --skip-deps     Skip dependency check
echo   --help, -h      Show this help message
echo.
echo Examples:
echo   %~nx0                # Start both services
echo   %~nx0 --mode web     # Start only web service
echo   %~nx0 --mode ai      # Start only AI engine
exit /b 0

:check_deps
if "%SKIP_DEPS%"=="true" goto :start_services

echo [INFO] Checking dependencies...

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] pnpm is not installed. Please install pnpm first.
    exit /b 1
)

where uv >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] uv is not installed. Please install uv for Python dependency management.
    exit /b 1
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed.
    exit /b 1
)

echo [SUCCESS] All dependencies are installed!

:start_services
echo SupplyGraph Development Server
echo ==============================
echo [INFO] Starting services in mode: %MODE%

if /i "%MODE%"=="web" goto :start_web
if /i "%MODE%"=="ai" goto :start_ai
if /i "%MODE%"=="both" goto :start_both

echo [ERROR] Invalid mode. Use: web, ai, or both
exit /b 1

:start_web
echo [INFO] Starting web service only...
cd apps/web
pnpm dev
goto :end

:start_ai
echo [INFO] Starting AI engine only...
cd apps/ai-engine
set PYTHONPATH=.
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
goto :end

:start_both
echo [INFO] Starting both web and AI services...

REM Start AI engine in background
start "AI Engine" /D apps\ai-engine cmd /C "set PYTHONPATH=. && uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a moment for AI engine to start
timeout /t 2 /nobreak >nul

REM Start web service
start "Web App" /D apps\web pnpm dev

echo [SUCCESS] Services started!
echo [INFO] Web: http://localhost:3000
echo [INFO] AI Engine: http://localhost:8000
echo [INFO] API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop all services...
pause >nul

REM Stop background processes
taskkill /f /im uvicorn.exe 2>nul
taskkill /f /im node.exe 2>nul

:end
cd ..\..