Write-Host "Starting Protexcel App..." -ForegroundColor Cyan

# Start Backend (Python Flask)
Write-Host "Launching Backend..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd 'backend'; python scam_model.py; python server.py"

# Start Frontend (Vite)
Write-Host "Launching Frontend..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "Protexcel is running!" -ForegroundColor Cyan
Write-Host "Backend: http://127.0.0.1:5000" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Gray
