@echo off
echo ========================================================
echo  Starting Fenil Rami Portfolio (Backend + Frontend)
echo ========================================================
echo.
echo [1/2] Launching Django Backend at http://127.0.0.1:8000/ ...
start "Portfolio Backend (Django)" cmd /k "cd backend && (if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) else (call .venv\Scripts\activate.bat)) && python manage.py runserver 127.0.0.1:8000"

echo [2/2] Launching React Vite Frontend at http://localhost:5173/ ...
start "Portfolio Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are launching in separate windows!
echo - Public Site:       http://localhost:5173/
echo - Frontend Admin:    http://localhost:5173/admin/
echo - Django Unfold:     http://127.0.0.1:8000/admin/
echo - API Docs / Root:   http://127.0.0.1:8000/
echo ========================================================
