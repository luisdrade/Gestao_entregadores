# Script de Deploy Automatizado para Frontend (PowerShell)
# Uso: .\deploy.ps1 [vercel|netlify|railway]

param(
    [string]$Platform = "vercel"
)

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"

Write-Host "🚀 Iniciando deploy do frontend..." -ForegroundColor $Green

# Verificar se o arquivo .env.local existe
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Arquivo .env.local não encontrado. Criando a partir do exemplo..." -ForegroundColor $Yellow
    Copy-Item "env.example" ".env.local"
    Write-Host "❌ Por favor, edite o arquivo .env.local com suas configurações antes de continuar." -ForegroundColor $Red
    exit 1
}

# Verificar se a URL da API está configurada
$envContent = Get-Content ".env.local" -Raw
if ($envContent -notmatch "VITE_API_BASE_URL" -or $envContent -match "seu-backend.railway.app") {
    Write-Host "❌ Por favor, configure a VITE_API_BASE_URL no arquivo .env.local" -ForegroundColor $Red
    exit 1
}

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor $Green
npm install

# Build do projeto
Write-Host "🔨 Fazendo build do projeto..." -ForegroundColor $Green
npm run build

# Deploy baseado no argumento
switch ($Platform) {
    "vercel" {
        Write-Host "🚀 Fazendo deploy no Vercel..." -ForegroundColor $Green
        if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
            Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor $Yellow
            npm i -g vercel
        }
        vercel --prod
    }
    "netlify" {
        Write-Host "🚀 Fazendo deploy no Netlify..." -ForegroundColor $Green
        if (-not (Get-Command netlify -ErrorAction SilentlyContinue)) {
            Write-Host "📦 Instalando Netlify CLI..." -ForegroundColor $Yellow
            npm i -g netlify-cli
        }
        netlify deploy --prod
    }
    "railway" {
        Write-Host "🚀 Fazendo deploy no Railway..." -ForegroundColor $Green
        if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
            Write-Host "📦 Instalando Railway CLI..." -ForegroundColor $Yellow
            npm i -g @railway/cli
        }
        railway up
    }
    default {
        Write-Host "❌ Plataforma não suportada. Use: vercel, netlify ou railway" -ForegroundColor $Red
        exit 1
    }
}

Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor $Green
Write-Host "💡 Lembre-se de configurar as variáveis de ambiente na plataforma escolhida." -ForegroundColor $Yellow

