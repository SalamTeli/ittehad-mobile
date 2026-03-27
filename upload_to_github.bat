@echo off
title Upload to GitHub - IFS Mobile App
color 0A
cls

echo.
echo  =====================================================
echo   UPLOAD TO GITHUB - APK will auto-build!
echo  =====================================================
echo.

cd /d "%~dp0"

set /p USERNAME=  Enter your GitHub username: 

echo.
echo  Initializing git...
git init
git add .
git commit -m "Ittehad Financial Mobile App"
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%USERNAME%/ittehad-mobile.git

echo.
echo  Pushing to GitHub...
echo  (Enter your GitHub password or token when asked)
echo.
git push -u origin main

echo.
echo  =====================================================
echo   DONE! Now:
echo   1. Go to: github.com/%USERNAME%/ittehad-mobile
echo   2. Click "Actions" tab
echo   3. Wait 5-10 minutes for APK to build
echo   4. Download APK from "Artifacts" section
echo  =====================================================
echo.
pause
