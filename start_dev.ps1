# PowerShell startup script for Fenil Rami Portfolio
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting Fenil Rami Portfolio (Backend + Frontend)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$backendDir = Join-Path $PSScriptRoot "backend"
$frontendDir = Join-Path $PSScriptRoot "frontend"

Write-Host "`n[1/2] Starting Django Backend at http://127.0.0.1:8000/..." -ForegroundColor Yellow
$activateScript = if (Test-Path "$backendDir\venv\Scripts\Activate.ps1") { "$backendDir\venv\Scripts\Activate.ps1" } else { "$backendDir\.venv\Scripts\Activate.ps1" }
Start-Process -FilePath "powershell.exe" -WorkingDirectory $backendDir -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; & '$activateScript'; python manage.py runserver 127.0.0.1:8000"

Write-Host "[2/2] Starting React Vite Frontend at http://localhost:5173/..." -ForegroundColor Yellow
Start-Process -FilePath "powershell.exe" -WorkingDirectory $frontendDir -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev"

Write-Host "`nServers launched successfully!" -ForegroundColor Green
Write-Host " - Public Site:       http://localhost:5173/" -ForegroundColor White
Write-Host " - Frontend Admin:    http://localhost:5173/admin/" -ForegroundColor White
Write-Host " - Django Unfold Admin: http://127.0.0.1:8000/admin/" -ForegroundColor White
Write-Host " - Backend Root/Docs: http://127.0.0.1:8000/" -ForegroundColor White
Write-Host "========================================================`n" -ForegroundColor Cyan
