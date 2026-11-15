@echo off
echo ========================================================
echo Starting SignConnect AI (Backend + Frontend)
echo ========================================================

echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "SignConnect AI - Backend (FastAPI)" cmd /k "cd /d %~dp0 && "C:\Users\rajj2\AppData\Local\Programs\Python\Python313\python.exe" -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000"

timeout /t 2 /nobreak >nul

echo Starting Next.js Frontend on http://localhost:3000 ...
start "SignConnect AI - Frontend (Next.js)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers started!
echo Frontend: http://localhost:3000
echo Backend API Docs: http://127.0.0.1:8000/docs
echo ========================================================
pause

