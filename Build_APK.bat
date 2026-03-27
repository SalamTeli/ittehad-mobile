@echo off
title IFS - Build APK
color 0A
cls

echo.
echo  =====================================================
echo   ITTEHAD FINANCIAL - Build Android APK
echo   Using EAS Build (Cloud - No Android Studio needed)
echo  =====================================================
echo.

cd /d "%~dp0"

echo  [1] Installing EAS CLI...
call npm install -g eas-cli
echo.

echo  [2] Login to Expo account
echo  (Create free account at expo.dev if you don't have one)
echo.
call eas login
echo.

echo  [3] Building APK (runs on Expo cloud servers)...
echo  This takes 5-10 minutes. APK download link will appear.
echo.
call eas build --platform android --profile preview
echo.

echo  =====================================================
echo   Build complete! Download APK from the link above.
echo   Install on phone: Settings - Unknown Apps - Allow
echo  =====================================================
echo.
pause
