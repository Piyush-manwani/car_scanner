# EngineAI Installer
# Run this in PowerShell as Administrator:
# irm https://raw.githubusercontent.com/Piyush-manwani/car_scanner/main/install.ps1 | iex

$ErrorActionPreference = "Stop"

$REPO     = "Piyush-manwani/car_scanner"
$APP_NAME = "EngineAI"
$INSTALL_DIR = "$env:LOCALAPPDATA\EngineAI"
$BIN_DIR     = "$env:LOCALAPPDATA\EngineAI\bin"

function Write-Header {
    Clear-Host
    Write-Host ""
    Write-Host "  ███████╗███╗   ██╗ ██████╗ ██╗███╗   ██╗███████╗ █████╗ ██╗" -ForegroundColor Red
    Write-Host "  ██╔════╝████╗  ██║██╔════╝ ██║████╗  ██║██╔════╝██╔══██╗██║" -ForegroundColor Red
    Write-Host "  █████╗  ██╔██╗ ██║██║  ███╗██║██╔██╗ ██║█████╗  ███████║██║" -ForegroundColor DarkRed
    Write-Host "  ██╔══╝  ██║╚██╗██║██║   ██║██║██║╚██╗██║██╔══╝  ██╔══██║██║" -ForegroundColor DarkRed
    Write-Host "  ███████╗██║ ╚████║╚██████╔╝██║██║ ╚████║███████╗██║  ██║██║" -ForegroundColor DarkRed
    Write-Host "  ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝" -ForegroundColor DarkRed
    Write-Host ""
    Write-Host "  AI-Powered Car Diagnostic Scanner" -ForegroundColor Gray
    Write-Host "  Powered by GPT-4o via GitHub Models (Free)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  ─────────────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host ""
}

function Write-Step {
    param([string]$msg)
    Write-Host "  ► $msg" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$msg)
    Write-Host "  ✓ $msg" -ForegroundColor Green
}

function Write-Fail {
    param([string]$msg)
    Write-Host "  ✗ $msg" -ForegroundColor Red
}

function Check-NodeJS {
    try {
        $version = node --version 2>$null
        if ($version) {
            Write-Success "Node.js found: $version"
            return $true
        }
    } catch {}
    return $false
}

function Install-NodeJS {
    Write-Step "Node.js not found. Downloading installer..."
    $nodeUrl = "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
    $nodeMsi = "$env:TEMP\node-installer.msi"
    Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeMsi -UseBasicParsing
    Write-Step "Installing Node.js..."
    Start-Process msiexec.exe -ArgumentList "/i `"$nodeMsi`" /quiet /norestart" -Wait
    Remove-Item $nodeMsi -Force
    # Refresh PATH
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
    Write-Success "Node.js installed"
}

function Get-LatestRelease {
    Write-Step "Fetching latest release from GitHub..."
    $apiUrl = "https://api.github.com/repos/$REPO/releases/latest"
    try {
        $release = Invoke-RestMethod -Uri $apiUrl -UseBasicParsing
        $msiAsset = $release.assets | Where-Object { $_.name -like "*.msi" } | Select-Object -First 1
        if ($msiAsset) {
            return @{ version = $release.tag_name; url = $msiAsset.browser_download_url; name = $msiAsset.name }
        }
    } catch {}
    return $null
}

function Install-FromMSI {
    param([string]$url, [string]$name, [string]$version)
    Write-Step "Downloading $name ($version)..."
    $msiPath = "$env:TEMP\$name"
    Invoke-WebRequest -Uri $url -OutFile $msiPath -UseBasicParsing
    Write-Step "Installing $APP_NAME..."
    Start-Process msiexec.exe -ArgumentList "/i `"$msiPath`" /quiet /norestart" -Wait
    Remove-Item $msiPath -Force
    Write-Success "$APP_NAME $version installed"
}

function Install-FromSource {
    Write-Step "No MSI release found. Installing from source..."

    # Create install directory
    if (Test-Path $INSTALL_DIR) { Remove-Item $INSTALL_DIR -Recurse -Force }
    New-Item -ItemType Directory -Path $INSTALL_DIR -Force | Out-Null

    # Check git
    $hasGit = $null -ne (Get-Command git -ErrorAction SilentlyContinue)
    if ($hasGit) {
        Write-Step "Cloning repository..."
        git clone "https://github.com/$REPO.git" $INSTALL_DIR --quiet
    } else {
        Write-Step "Downloading source code..."
        $zipUrl  = "https://github.com/$REPO/archive/refs/heads/main.zip"
        $zipPath = "$env:TEMP\engineai-src.zip"
        Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing
        Expand-Archive -Path $zipPath -DestinationPath "$env:TEMP\engineai-extract" -Force
        $extracted = Get-ChildItem "$env:TEMP\engineai-extract" | Select-Object -First 1
        Copy-Item "$($extracted.FullName)\*" $INSTALL_DIR -Recurse -Force
        Remove-Item $zipPath, "$env:TEMP\engineai-extract" -Recurse -Force
    }

    Write-Step "Installing dependencies (this may take a minute)..."
    Set-Location $INSTALL_DIR
    npm install --silent
    Write-Success "Dependencies installed"
}

function Create-CLICommand {
    Write-Step "Creating 'engineai' terminal command..."

    # Create bin directory
    New-Item -ItemType Directory -Path $BIN_DIR -Force | Out-Null

    # Create engineai.cmd
    $cmdContent = @"
@echo off
if "%1"=="start"   ( cd /d "$INSTALL_DIR" && npm start && goto :eof )
if "%1"=="update"  ( powershell -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/$REPO/main/install.ps1 | iex" && goto :eof )
if "%1"=="version" ( echo EngineAI v1.0.0 && goto :eof )
if "%1"=="help"    ( goto :help )
if "%1"==""        ( cd /d "$INSTALL_DIR" && npm start && goto :eof )

:help
echo.
echo   EngineAI - AI Car Diagnostic Scanner
echo.
echo   Usage:
echo     engineai            - Launch the app
echo     engineai start      - Launch the app
echo     engineai update     - Update to latest version
echo     engineai version    - Show version
echo     engineai help       - Show this help
echo.
goto :eof
"@
    Set-Content -Path "$BIN_DIR\engineai.cmd" -Value $cmdContent -Encoding ASCII

    # Add to PATH if not already there
    $currentPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
    if ($currentPath -notlike "*$BIN_DIR*") {
        [System.Environment]::SetEnvironmentVariable("PATH", "$currentPath;$BIN_DIR", "User")
        $env:PATH += ";$BIN_DIR"
        Write-Success "Added 'engineai' to PATH"
    } else {
        Write-Success "'engineai' command already in PATH"
    }
}

function Create-Shortcut {
    Write-Step "Creating desktop shortcut..."
    $desktop = [System.Environment]::GetFolderPath("Desktop")
    $shortcut = (New-Object -ComObject WScript.Shell).CreateShortcut("$desktop\EngineAI.lnk")
    $shortcut.TargetPath = "$BIN_DIR\engineai.cmd"
    $shortcut.WorkingDirectory = $INSTALL_DIR
    $shortcut.Description = "EngineAI - AI Car Diagnostic Scanner"
    if (Test-Path "$INSTALL_DIR\icon.ico") {
        $shortcut.IconLocation = "$INSTALL_DIR\icon.ico"
    }
    $shortcut.Save()
    Write-Success "Desktop shortcut created"
}

# ── MAIN ──────────────────────────────────────

Write-Header

Write-Host "  Starting installation..." -ForegroundColor White
Write-Host ""

# Step 1: Check Node.js
Write-Step "Checking Node.js..."
if (-not (Check-NodeJS)) { Install-NodeJS }

# Step 2: Try MSI first, fall back to source
$release = Get-LatestRelease
if ($release) {
    Install-FromMSI -url $release.url -name $release.name -version $release.version
} else {
    Install-FromSource
}

# Step 3: Create CLI command
Create-CLICommand

# Step 4: Desktop shortcut
Create-Shortcut

# Done!
Write-Host ""
Write-Host "  ─────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  ✓ EngineAI installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "  You can now run it with:" -ForegroundColor White
Write-Host ""
Write-Host "    engineai" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Or open 'EngineAI' from your Desktop." -ForegroundColor Gray
Write-Host ""
Write-Host "  Other commands:" -ForegroundColor White
Write-Host "    engineai update    - Update to latest version" -ForegroundColor Gray
Write-Host "    engineai version   - Show version" -ForegroundColor Gray
Write-Host "    engineai help      - Show all commands" -ForegroundColor Gray
Write-Host ""
Write-Host "  ─────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Note: Restart your terminal for the 'engineai'" -ForegroundColor DarkGray
Write-Host "  command to work in new windows." -ForegroundColor DarkGray
Write-Host ""
