@echo off
title Building IFS APK
color 0A
cls

echo.
echo  =====================================================
echo   ITTEHAD FINANCIAL - Building APK
echo  =====================================================
echo.

cd /d "%~dp0"

:: Create local.properties with SDK path
echo sdk.dir=C\:\\Users\\salam\\AppData\\Local\\Android\\Sdk > android\local.properties
echo  [OK] local.properties created

:: Accept licenses silently
echo  Accepting Android licenses...
echo y | C:\Users\salam\AppData\Local\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat --licenses >nul 2>&1

:: Build APK
echo  Building APK...
echo.
cd android
call gradlew.bat assembleDebug

if exist "app\build\outputs\apk\debug\app-debug.apk" (
    copy /Y "app\build\outputs\apk\debug\app-debug.apk" "..\IFS-Mobile-App.apk"
    echo.
    echo  =====================================================
    echo   SUCCESS! APK saved: IFS-Mobile-App.apk
    echo  =====================================================
) else (
    echo  [ERROR] Build failed. Check errors above.
)
echo.
pause
