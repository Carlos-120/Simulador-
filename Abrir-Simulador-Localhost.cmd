@echo off
start "" /b node "%~dp0servir-simulador-local.js"
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:8765/"
