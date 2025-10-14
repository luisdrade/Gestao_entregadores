# Script de Deploy com Ambiente Virtual (PowerShell)
# Uso: .\deploy_with_venv.ps1

param(
    [string]$VenvPath = "venv"
)

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"

Write-Host "🚀 Iniciando deploy com ambiente virtual..." -ForegroundColor $Green

# Verificar se o ambiente virtual existe
if (-not (Test-Path $VenvPath)) {
    Write-Host "❌ Ambiente virtual não encontrado em: $VenvPath" -ForegroundColor $Red
    Write-Host "💡 Crie o ambiente virtual primeiro com: python -m venv venv" -ForegroundColor $Yellow
    exit 1
}

# Ativar ambiente virtual
Write-Host "🔧 Ativando ambiente virtual..." -ForegroundColor $Green
& "$VenvPath\Scripts\Activate.ps1"

# Verificar se o Railway CLI está instalado
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Instalando Railway CLI..." -ForegroundColor $Yellow
    npm install -g @railway/cli
}

# Verificar se está logado no Railway
Write-Host "🔐 Verificando login no Railway..." -ForegroundColor $Green
$loginCheck = railway whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔑 Fazendo login no Railway..." -ForegroundColor $Yellow
    railway login
}

# Verificar se o projeto está inicializado
if (-not (Test-Path ".railway")) {
    Write-Host "🏗️ Inicializando projeto no Railway..." -ForegroundColor $Green
    railway init
}

# Verificar se o MySQL está adicionado
Write-Host "🗄️ Verificando banco MySQL..." -ForegroundColor $Green
$services = railway status 2>$null | Select-String "mysql"
if (-not $services) {
    Write-Host "📊 Adicionando banco MySQL..." -ForegroundColor $Yellow
    railway add mysql
}

# Configurar variáveis de ambiente
Write-Host "⚙️ Configurando variáveis de ambiente..." -ForegroundColor $Green

# Solicitar informações do usuário
$secretKey = Read-Host "Digite sua DJANGO_SECRET_KEY (ou pressione Enter para gerar uma)"
if ([string]::IsNullOrEmpty($secretKey)) {
    $secretKey = -join ((65..90) + (97..122) | Get-Random -Count 50 | ForEach-Object {[char]$_})
    Write-Host "🔑 Chave secreta gerada: $($secretKey.Substring(0, 20))..." -ForegroundColor $Yellow
}

$appName = Read-Host "Digite o nome do seu app no Railway (ex: gestao-entregadores)"

# Configurar variáveis
railway variables set DJANGO_SECRET_KEY="$secretKey"
railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS="$appName.railway.app,localhost,127.0.0.1"
railway variables set STATIC_URL="/static/"
railway variables set STATIC_ROOT="/app/staticfiles"
railway variables set MEDIA_URL="/media/"
railway variables set MEDIA_ROOT="/app/media"

# Fazer deploy
Write-Host "🚀 Fazendo deploy..." -ForegroundColor $Green
railway up

# Aguardar um pouco para o deploy
Write-Host "⏳ Aguardando deploy..." -ForegroundColor $Yellow
Start-Sleep -Seconds 10

# Executar migrações
Write-Host "🗄️ Executando migrações..." -ForegroundColor $Green
railway run python manage.py migrate

# Coletar arquivos estáticos
Write-Host "📁 Coletando arquivos estáticos..." -ForegroundColor $Green
railway run python manage.py collectstatic --noinput

# Criar superusuário
Write-Host "👤 Criando superusuário..." -ForegroundColor $Green
Write-Host "💡 Siga as instruções para criar o superusuário:" -ForegroundColor $Yellow
railway run python manage.py createsuperuser

# Abrir aplicação
Write-Host "🌐 Abrindo aplicação..." -ForegroundColor $Green
railway open

Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor $Green
Write-Host "🔗 Sua aplicação está disponível em: https://$appName.railway.app" -ForegroundColor $Green
Write-Host "👨‍💼 Admin Django: https://$appName.railway.app/admin/" -ForegroundColor $Green

