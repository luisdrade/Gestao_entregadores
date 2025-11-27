# Script para iniciar backend + ngrok para demo mobile
# Uso: .\scripts\start-demo-backend.ps1

Write-Host "🚀 Iniciando Backend + ngrok para Demo Mobile" -ForegroundColor Cyan
Write-Host ""

# Verificar se ngrok está instalado
$ngrokPath = Get-Command ngrok -ErrorAction SilentlyContinue
if (-not $ngrokPath) {
    Write-Host "❌ ngrok não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Instale o ngrok:" -ForegroundColor Yellow
    Write-Host "   1. Baixe: https://ngrok.com/download" -ForegroundColor Gray
    Write-Host "   2. Extraia e adicione ao PATH" -ForegroundColor Gray
    Write-Host "   3. Crie conta: https://dashboard.ngrok.com/signup" -ForegroundColor Gray
    Write-Host "   4. Configure: ngrok config add-authtoken SEU_TOKEN" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Verificar se está no diretório correto
if (-not (Test-Path "backend\manage.py")) {
    Write-Host "❌ Execute este script da raiz do projeto!" -ForegroundColor Red
    exit 1
}

# Verificar ambiente virtual
$venvPath = "backend\venv\Scripts\Activate.ps1"
if (-not (Test-Path $venvPath)) {
    Write-Host "⚠️  Ambiente virtual não encontrado!" -ForegroundColor Yellow
    Write-Host "   Criando ambiente virtual..." -ForegroundColor Gray
    cd backend
    python -m venv venv
    cd ..
}

Write-Host "✅ Verificações concluídas" -ForegroundColor Green
Write-Host ""

# Ativar ambiente virtual e rodar backend em background
Write-Host "📦 Ativando ambiente virtual..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    & "backend\venv\Scripts\python.exe" -m pip install -q -r backend\requirements.txt
    & "backend\venv\Scripts\Activate.ps1"
    Set-Location backend
    python manage.py runserver 0.0.0.0:8000
}

# Aguardar backend iniciar
Write-Host "⏳ Aguardando backend iniciar (5 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Iniciar ngrok
Write-Host "🌐 Iniciando túnel ngrok..." -ForegroundColor Cyan
Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  URL do ngrok será exibida abaixo" -ForegroundColor Yellow
Write-Host "  Copie a URL HTTPS e use em frontend/src/config/api.js" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Rodar ngrok (isso vai mostrar a interface do ngrok)
Start-Process ngrok -ArgumentList "http", "8000" -NoNewWindow

Write-Host ""
Write-Host "✅ Backend rodando em: http://localhost:8000" -ForegroundColor Green
Write-Host "✅ ngrok criando túnel HTTPS..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Copie a URL HTTPS do ngrok (ex: https://abc123.ngrok-free.app)" -ForegroundColor Gray
Write-Host "   2. Edite frontend/src/config/api.js:" -ForegroundColor Gray
Write-Host "      BASE_URL: 'https://SUA_URL_NGROK.ngrok-free.app/api'" -ForegroundColor Gray
Write-Host "   3. Rode o app mobile: cd frontend && npx expo start --tunnel" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  Para parar: Pressione Ctrl+C e feche esta janela" -ForegroundColor Yellow
Write-Host ""

# Manter script rodando
try {
    Wait-Job $backendJob
} catch {
    Write-Host "❌ Erro ao rodar backend" -ForegroundColor Red
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
}


