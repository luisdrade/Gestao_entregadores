# Script PowerShell para iniciar o servidor Django em 0.0.0.0:8000
Write-Host "Iniciando servidor Django em 0.0.0.0:8000..." -ForegroundColor Green
Write-Host "Para parar o servidor, pressione Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Ativa o ambiente virtual se existir
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "Ativando ambiente virtual..." -ForegroundColor Cyan
    & ".\venv\Scripts\Activate.ps1"
}

# Inicia o servidor
python manage.py runserver 0.0.0.0:8000
