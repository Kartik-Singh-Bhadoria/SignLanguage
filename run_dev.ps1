Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting SignConnect AI (Backend + Frontend)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend in a new window
Write-Host "Starting FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir'; & 'C:\Users\rajj2\AppData\Local\Programs\Python\Python313\python.exe' -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000"

Start-Sleep -Seconds 2

# Start Frontend in a new window
Write-Host "Starting Next.js Frontend on http://localhost:3000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\frontend'; npm run dev"

Write-Host "`nBoth services launched!" -ForegroundColor Yellow
Write-Host "Frontend App:        http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API Swagger: http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

