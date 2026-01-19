# PowerShell script to package the VS Code extension

Write-Host "Spring HTTP Generator - Package Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if vsce is installed
Write-Host "Checking for vsce..." -ForegroundColor Yellow
$vsceInstalled = Get-Command vsce -ErrorAction SilentlyContinue

if (-not $vsceInstalled) {
    Write-Host "vsce not found. Installing globally..." -ForegroundColor Red
    npm install -g @vscode/vsce
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install vsce" -ForegroundColor Red
        exit 1
    }
    Write-Host "vsce installed successfully" -ForegroundColor Green
}
else {
    Write-Host "vsce is already installed" -ForegroundColor Green
}

Write-Host ""

# Clean previous build
Write-Host "Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
}
if (Test-Path "*.vsix") {
    Remove-Item -Force "*.vsix"
}
Write-Host "Clean complete" -ForegroundColor Green

Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed" -ForegroundColor Green

Write-Host ""

# Compile TypeScript
Write-Host "Compiling TypeScript..." -ForegroundColor Yellow
npm run compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "Compilation failed" -ForegroundColor Red
    exit 1
}
Write-Host "Compilation successful" -ForegroundColor Green

Write-Host ""

# Package extension
Write-Host "Packaging extension..." -ForegroundColor Yellow
if (!(Test-Path "dist")) { New-Item -ItemType Directory -Force "dist" }
npx vsce package --out "dist/"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Packaging failed"
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Extension packaged successfully!" -ForegroundColor Green
Write-Host ""

# Find the generated VSIX file
$vsixFile = Get-ChildItem -Filter "*.vsix" | Select-Object -First 1

if ($vsixFile) {
    Write-Host "Package created: $($vsixFile.Name)" -ForegroundColor Cyan
    Write-Host "Location: $($vsixFile.FullName)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To install the extension, run:" -ForegroundColor Yellow
    Write-Host "   code --install-extension $($vsixFile.Name)" -ForegroundColor White
    Write-Host ""
    Write-Host "To publish to marketplace:" -ForegroundColor Yellow
    Write-Host "   vsce publish" -ForegroundColor White
}
else {
    Write-Host "VSIX file not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Done!" -ForegroundColor Green
