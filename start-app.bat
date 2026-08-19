@echo off
title KVARtIRA MINI APP
echo ====================================
echo   KVARtIRA - Server + Telegram Bot
echo   Sayt: http://localhost:3000
echo   Bot:  @Hamroh11_bot
echo ====================================
cd /d "%~dp0"
echo.
echo [1/2] Serverni ishga tushirish...
start "KVARtIRA Server" cmd /k "node server.js"
timeout /t 2 >nul
echo [2/2] Telegram botni ishga tushirish...
start "KVARtIRA Bot" cmd /k "node src/bot.js"
echo.
echo Ikkalasi ham ishga tushdi!
echo Telegram'da @Hamroh11_bot ga /start yuboring.
timeout /t 3 >nul
exit