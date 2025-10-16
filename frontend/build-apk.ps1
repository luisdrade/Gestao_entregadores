# Script para Build APK do App Expo
# Autor: Sistema de Gestão de Entregadores
# Descrição: Automatiza o processo de build de APK usando EAS CLI

Write-Host "🚀 Iniciando Build APK do App Expo..." -ForegroundColor Green
Write-Host ""

# Verificar se estamos no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script no diretório frontend do projeto" -ForegroundColor Red
    Write-Host "   cd frontend" -ForegroundColor Yellow
    Write-Host "   .\build-apk.ps1" -ForegroundColor Yellow
    exit 1
}

# Verificar se Node.js está instalado
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Instale Node.js primeiro:" -ForegroundColor Red
    Write-Host "   https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar se EAS CLI está instalado
Write-Host "🔍 Verificando EAS CLI..." -ForegroundColor Cyan
try {
    $easVersion = npx eas-cli@latest --version
    Write-Host "✅ EAS CLI encontrado: $easVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  EAS CLI não encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g @expo/eas-cli
}

# Verificar se está logado no EAS
Write-Host "🔍 Verificando login EAS..." -ForegroundColor Cyan
try {
    $whoami = npx eas-cli@latest whoami
    Write-Host "✅ Logado como: $whoami" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Não está logado no EAS. Fazendo login..." -ForegroundColor Yellow
    Write-Host "   Abra o navegador para fazer login..." -ForegroundColor Cyan
    npx eas-cli@latest login
}

Write-Host ""
Write-Host "📦 Iniciando build APK..." -ForegroundColor Green
Write-Host "   Plataforma: Android" -ForegroundColor Cyan
Write-Host "   Perfil: preview" -ForegroundColor Cyan
Write-Host "   Tipo: APK" -ForegroundColor Cyan
Write-Host ""

# Executar build
Write-Host "⏳ Aguarde... O build pode levar 5-15 minutos..." -ForegroundColor Yellow
Write-Host ""

try {
    npx eas-cli@latest build --platform android --profile preview --non-interactive
    Write-Host ""
    Write-Host "🎉 Build concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Próximos passos:" -ForegroundColor Cyan
    Write-Host "   1. Acesse o link fornecido acima para baixar o APK" -ForegroundColor White
    Write-Host "   2. No seu Android, vá em Configurações > Segurança" -ForegroundColor White
    Write-Host "   3. Habilite 'Fontes desconhecidas' ou 'Instalar apps desconhecidos'" -ForegroundColor White
    Write-Host "   4. Baixe e instale o APK no seu dispositivo" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Dica: O APK ficará disponível por 30 dias no Expo" -ForegroundColor Yellow
} catch {
    Write-Host ""
    Write-Host "❌ Erro durante o build:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Possíveis soluções:" -ForegroundColor Yellow
    Write-Host "   - Verifique sua conexão com a internet" -ForegroundColor White
    Write-Host "   - Execute: npx eas-cli@latest login" -ForegroundColor White
    Write-Host "   - Verifique se o projeto está configurado corretamente" -ForegroundColor White
    Write-Host "   - Consulte a documentação: frontend/BUILD_APK.md" -ForegroundColor White
}

Write-Host ""
Write-Host "📚 Para mais informações, consulte: frontend/BUILD_APK.md" -ForegroundColor Cyan

