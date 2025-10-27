# Script para iniciar o backend em modo local com SQLite

Write-Host "🚀 Iniciando Backend em modo LOCAL..." -ForegroundColor Green

# Forçar uso de SQLite localmente
$env:USE_LOCAL_DB = "true"
Write-Host "⚙️  Configurado para usar SQLite local" -ForegroundColor Cyan

# Criar/atualizar banco de dados
Write-Host "📦 Criando banco de dados SQLite..." -ForegroundColor Yellow
python manage.py migrate

Write-Host "✅ Banco de dados criado!" -ForegroundColor Green

# Criar superusuário (se não existir)
Write-Host "👤 Criando superusuário..." -ForegroundColor Yellow
python manage.py createsuperuser --noinput --email admin@admin.com --username admin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Superusuário já existe ou houve erro (ignore)" -ForegroundColor Yellow
}

# Iniciar servidor
Write-Host "🌟 Iniciando servidor em http://0.0.0.0:8000..." -ForegroundColor Green
Write-Host ""
Write-Host "✅ Backend pronto!" -ForegroundColor Green
Write-Host "📱 Configure o app para usar: http://10.0.2.2:8000" -ForegroundColor Cyan
Write-Host ""

python manage.py runserver 0.0.0.0:8000

