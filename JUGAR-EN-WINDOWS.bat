@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Backrooms Together

where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo   No encuentro Node.js instalado en este PC.
  echo   Ve a https://nodejs.org , descarga el boton verde que dice "LTS",
  echo   instalalo, y despues vuelve a hacer doble click en este archivo.
  echo.
  pause
  exit /b
)

if not exist node_modules (
  echo Instalando lo necesario, un momento la primera vez...
  call npm install
  echo.
)

echo.
echo ==============================================================
echo   Backrooms Together esta corriendo.
echo.
echo   TU juegas en este mismo PC entrando a:
echo       http://localhost:3000
echo.
echo   Tu hermano entra DESDE SU CELULAR (misma wifi de esta casa)
echo   escribiendo en su navegador una de estas direcciones:
echo.
ipconfig | findstr /R /C:"IPv4"
echo.
echo   Prueba la que empiece con 192.168. o 10. seguida de :3000
echo   Ejemplo: http://192.168.1.23:3000
echo.
echo   Deja esta ventana abierta mientras juegan. Para cerrar el
echo   juego, simplemente cierra esta ventana.
echo ==============================================================
echo.

start http://localhost:3000
node server.js

pause
