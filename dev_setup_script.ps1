# HTML Editor Development Setup Script for PowerShell
# This script sets up and runs both frontend and backend servers

# Stop on first error
$ErrorActionPreference = "Stop"

Write-Host "🚀 HTML Editor Development Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Function to print colored output
function Write-StatusMessage($message) {
    Write-Host "✅ $message" -ForegroundColor Green
}

function Write-WarningMessage($message) {
    Write-Host "⚠️ $message" -ForegroundColor Yellow
}

function Write-ErrorMessage($message) {
    Write-Host "❌ $message" -ForegroundColor Red
}

function Write-InfoMessage($message) {
    Write-Host "ℹ️ $message" -ForegroundColor Blue
}

# Check if Node.js is installed
function Test-NodeInstallation {
    try {
        $nodeVersion = node --version
        Write-StatusMessage "Node.js version: $nodeVersion"
        
        # Check if version is >= 16
        $versionNumber = $nodeVersion.Substring(1).Split('.')[0]
        if ([int]$versionNumber -lt 16) {
            Write-WarningMessage "Node.js 16+ recommended. Current: $nodeVersion"
        }
    }
    catch {
        Write-ErrorMessage "Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
        exit 1
    }
}

# Check if Python is installed
function Test-PythonInstallation {
    try {
        $pythonVersion = (python --version 2>&1).ToString()
        Write-StatusMessage "Python version: $pythonVersion"
    }
    catch {
        try {
            $pythonVersion = (python3 --version 2>&1).ToString()
            Write-StatusMessage "Python version: $pythonVersion"
        }
        catch {
            Write-ErrorMessage "Python is not installed. Please install Python 3.7+ from https://python.org/"
            exit 1
        }
    }
}

# Install frontend dependencies
function Install-FrontendDependencies {
    Write-InfoMessage "Setting up frontend dependencies..."
    
    if (-not (Test-Path "package.json")) {
        Write-ErrorMessage "package.json not found. Please ensure you're in the correct directory."
        exit 1
    }
    
    # Install npm dependencies
    npm install
    Write-StatusMessage "Frontend dependencies installed"
}

# Install backend dependencies
function Install-BackendDependencies {
    Write-InfoMessage "Setting up backend dependencies..."
    
    # Change to backend directory
    Push-Location backend
    
    if (-not (Test-Path "requirements.txt")) {
        Pop-Location
        Write-ErrorMessage "backend/requirements.txt not found. Please ensure the backend folder is set up correctly."
        exit 1
    }
    
    # Create virtual environment if it doesn't exist
    if (-not (Test-Path "venv")) {
        Write-InfoMessage "Creating Python virtual environment in backend folder..."
        python -m venv venv
    }
    
    # Activate virtual environment
    if (Test-Path "venv\Scripts\activate.ps1") {
        & .\venv\Scripts\activate.ps1
    } else {
        Pop-Location
        Write-ErrorMessage "Virtual environment activation script not found."
        exit 1
    }
    
    # Install Python dependencies
    pip install -r requirements.txt
    
    # Return to original directory
    Pop-Location
    
    Write-StatusMessage "Backend dependencies installed"
}

# Create necessary directories according to FileSystemConfig in suggestions.md
function New-ProjectDirectories {
    Write-InfoMessage "Creating project directories..."
    
    # Create all required directories as specified in the architecture
    $directories = @(
        "backend\data\templates",
        "backend\data\projects", 
        "backend\data\assets",
        "backend\data\backups",
        "public",
        "dist"
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-StatusMessage "Created directory: $dir"
        } else {
            Write-InfoMessage "Directory already exists: $dir"
        }
    }
    
    Write-StatusMessage "Project directories created"
}

# Start the development servers
function Start-DevelopmentServers {
    Write-InfoMessage "Starting development servers..."
    
    # Start backend server in a new PowerShell window
    Write-InfoMessage "Starting Python backend server on http://localhost:5000..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; .\venv\Scripts\activate.ps1; python app.py"
    
    # Wait a moment for backend to start
    Start-Sleep -Seconds 3
    
    # Start frontend server in a new PowerShell window
    Write-InfoMessage "Starting frontend development server on http://localhost:3000..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
    
    Write-StatusMessage "Development servers started!"
    Write-InfoMessage "Frontend: http://localhost:3000"
    Write-InfoMessage "Backend API: http://localhost:5000/api"
    Write-InfoMessage "WebSocket: ws://localhost:5000/ws"
    Write-InfoMessage "Close the server windows when you're done"
}

# Main execution
function Start-Main {
    Write-Host ""
    Write-InfoMessage "Checking system requirements..."
    Test-NodeInstallation
    Test-PythonInstallation
    Write-Host ""
    
    Write-InfoMessage "Setting up project..."
    New-ProjectDirectories
    Install-FrontendDependencies
    Install-BackendDependencies
    Write-Host ""
    
    Write-StatusMessage "Setup complete! Starting development servers..."
    Write-Host ""
    Start-DevelopmentServers
}

# Run main function
Start-Main