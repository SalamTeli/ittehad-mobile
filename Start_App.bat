@echo off
title IFS Mobile App - Setup
color 0A
cls

echo.
echo  =====================================================
echo   ITTEHAD FINANCIAL - React Native App Setup
echo  =====================================================
echo.

:: Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found! Install from nodejs.org
    pause & exit
)
echo  [OK] Node.js found.

:: Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] npm not found!
    pause & exit
)
echo  [OK] npm found.
echo.

cd /d "%~dp0"

echo  Installing packages (first time takes 2-3 minutes)...
echo  -------------------------------------------------------
call npm install
echo  -------------------------------------------------------
echo.

echo  =====================================================
echo   Starting Expo...
echo   1. Expo will show a QR code
echo   2. Install "Expo Go" from Play Store on your phone
echo   3. Open Expo Go and scan the QR code
echo   4. App will load on your phone!
echo  =====================================================
echo.
pause

call npx expo start --tunnel
