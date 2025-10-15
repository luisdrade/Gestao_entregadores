# Script PowerShell para popular despesas iniciais
# Execute: .\populate_despesas.ps1

Write-Host "🚀 Iniciando população de despesas..." -ForegroundColor Green

# Verificar se estamos no diretório correto
if (-not (Test-Path "manage.py")) {
    Write-Host "❌ Execute este script no diretório backend/" -ForegroundColor Red
    exit 1
}

# Ativar ambiente virtual se existir
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "🔧 Ativando ambiente virtual..." -ForegroundColor Yellow
    & "venv\Scripts\Activate.ps1"
}

# Executar migrações primeiro
Write-Host "📦 Executando migrações..." -ForegroundColor Yellow
python manage.py makemigrations
python manage.py migrate

# Popular despesas
Write-Host "💰 Populando despesas..." -ForegroundColor Yellow
python manage.py populate_despesas

Write-Host "✅ Processo concluído!" -ForegroundColor Green
Write-Host "📱 Agora você pode acessar o app e ver as despesas pré-cadastradas" -ForegroundColor Cyan
