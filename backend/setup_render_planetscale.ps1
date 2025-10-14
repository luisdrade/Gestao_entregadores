# Script de Configuração Render.com + PlanetScale
# Uso: .\setup_render_planetscale.ps1

param(
    [string]$GitHubRepo = "",
    [string]$AppName = "gestao-entregadores"
)

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

Write-Host "🚀 Configuração Render.com + PlanetScale MySQL" -ForegroundColor $Green
Write-Host "================================================" -ForegroundColor $Blue

# Verificar se está no diretório correto
if (-not (Test-Path "manage.py")) {
    Write-Host "❌ Execute este script no diretório backend/" -ForegroundColor $Red
    exit 1
}

# Verificar se está no Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Este não é um repositório Git" -ForegroundColor $Red
    Write-Host "💡 Execute: git init && git add . && git commit -m 'Initial commit'" -ForegroundColor $Yellow
    exit 1
}

Write-Host "✅ Diretório correto encontrado" -ForegroundColor $Green

# Verificar se tem mudanças não commitadas
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Mudanças não commitadas encontradas:" -ForegroundColor $Yellow
    Write-Host $gitStatus -ForegroundColor $Yellow
    
    $commit = Read-Host "Deseja fazer commit? (y/n)"
    if ($commit -eq "y" -or $commit -eq "Y") {
        git add .
        git commit -m "Configurações para Render.com + PlanetScale"
        Write-Host "✅ Commit realizado" -ForegroundColor $Green
    } else {
        Write-Host "⚠️  Faça commit das mudanças antes de continuar" -ForegroundColor $Yellow
        exit 1
    }
}

# Verificar se está conectado ao GitHub
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "❌ Nenhum repositório remoto configurado" -ForegroundColor $Red
    Write-Host "💡 Configure com: git remote add origin https://github.com/usuario/repositorio.git" -ForegroundColor $Yellow
    exit 1
}

Write-Host "✅ Repositório Git configurado: $remoteUrl" -ForegroundColor $Green

# Gerar chave secreta Django
$secretKey = -join ((65..90) + (97..122) | Get-Random -Count 50 | ForEach-Object {[char]$_})
Write-Host "🔑 Chave secreta Django gerada: $($secretKey.Substring(0, 20))..." -ForegroundColor $Yellow

# Solicitar informações do PlanetScale
Write-Host "`n📊 Configuração do PlanetScale:" -ForegroundColor $Blue
Write-Host "1. Acesse https://planetscale.com" -ForegroundColor $Yellow
Write-Host "2. Crie um banco chamado: $AppName" -ForegroundColor $Yellow
Write-Host "3. Anote as credenciais de conexão" -ForegroundColor $Yellow

$dbHost = Read-Host "Host do PlanetScale (ex: xxx.mysql.planetscale.com)"
$dbUser = Read-Host "Usuário do PlanetScale"
$dbPassword = Read-Host "Senha do PlanetScale" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

# Solicitar nome do app no Render
$renderAppName = Read-Host "Nome do app no Render (ex: $AppName)"

# Criar arquivo .env para referência
$envContent = @"
# Configurações para Render.com + PlanetScale
DJANGO_SECRET_KEY=$secretKey
DEBUG=False
ALLOWED_HOSTS=$renderAppName.onrender.com,localhost,127.0.0.1

# PlanetScale MySQL
DB_ENGINE=django.db.backends.mysql
DB_NAME=$AppName
DB_USER=$dbUser
DB_PASSWORD=$dbPasswordPlain
DB_HOST=$dbHost
DB_PORT=3306
DB_SSL_CA=-----BEGIN CERTIFICATE-----\nMIIEQTCCAqmgAwIBAgIUTtG6l4n1u1Y4rBmhJg==\n-----END CERTIFICATE-----

# Static Files
STATIC_URL=/static/
STATIC_ROOT=/opt/render/project/src/staticfiles

# Media Files
MEDIA_URL=/media/
MEDIA_ROOT=/opt/render/project/src/media

# CORS (configure depois)
CORS_ALLOWED_ORIGINS=https://seu-frontend.vercel.app,https://seu-frontend.netlify.app
"@

$envContent | Out-File -FilePath ".env.render" -Encoding UTF8
Write-Host "✅ Arquivo .env.render criado" -ForegroundColor $Green

# Instruções para Render.com
Write-Host "`n🌐 Próximos passos no Render.com:" -ForegroundColor $Blue
Write-Host "1. Acesse https://render.com" -ForegroundColor $Yellow
Write-Host "2. Faça login com GitHub" -ForegroundColor $Yellow
Write-Host "3. Clique em 'New +' > 'Web Service'" -ForegroundColor $Yellow
Write-Host "4. Conecte seu repositório: $remoteUrl" -ForegroundColor $Yellow
Write-Host "5. Configure:" -ForegroundColor $Yellow
Write-Host "   - Name: $renderAppName" -ForegroundColor $Yellow
Write-Host "   - Environment: Python 3" -ForegroundColor $Yellow
Write-Host "   - Build Command: pip install -r requirements.txt" -ForegroundColor $Yellow
Write-Host "   - Start Command: gunicorn sistema.wsgi:application" -ForegroundColor $Yellow
Write-Host "6. Adicione as variáveis de ambiente do arquivo .env.render" -ForegroundColor $Yellow

# Instruções para PlanetScale
Write-Host "`n🗄️ Configuração do PlanetScale:" -ForegroundColor $Blue
Write-Host "1. Acesse https://planetscale.com" -ForegroundColor $Yellow
Write-Host "2. Crie um banco chamado: $AppName" -ForegroundColor $Yellow
Write-Host "3. Anote as credenciais de conexão" -ForegroundColor $Yellow
Write-Host "4. Use as credenciais no Render.com" -ForegroundColor $Yellow

# Instruções pós-deploy
Write-Host "`n⚙️ Após o deploy no Render:" -ForegroundColor $Blue
Write-Host "1. Acesse o Shell do Render" -ForegroundColor $Yellow
Write-Host "2. Execute: python manage.py migrate" -ForegroundColor $Yellow
Write-Host "3. Execute: python manage.py createsuperuser" -ForegroundColor $Yellow
Write-Host "4. Execute: python manage.py collectstatic --noinput" -ForegroundColor $Yellow

Write-Host "`n✅ Configuração concluída!" -ForegroundColor $Green
Write-Host "🔗 Sua app estará em: https://$renderAppName.onrender.com" -ForegroundColor $Green
Write-Host "👨‍💼 Admin Django: https://$renderAppName.onrender.com/admin/" -ForegroundColor $Green

Write-Host "`n📁 Arquivos criados:" -ForegroundColor $Blue
Write-Host "- .env.render (variáveis de ambiente)" -ForegroundColor $Yellow
Write-Host "- DEPLOY_RENDER_PLANETSCALE.md (guia completo)" -ForegroundColor $Yellow

