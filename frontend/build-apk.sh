#!/bin/bash

# Script para Build APK do App Expo
# Autor: Sistema de Gestão de Entregadores
# Descrição: Automatiza o processo de build de APK usando EAS CLI

echo "🚀 Iniciando Build APK do App Expo..."
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório frontend do projeto"
    echo "   cd frontend"
    echo "   ./build-apk.sh"
    exit 1
fi

# Verificar se Node.js está instalado
echo "🔍 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js encontrado: $NODE_VERSION"
else
    echo "❌ Node.js não encontrado. Instale Node.js primeiro:"
    echo "   https://nodejs.org/"
    exit 1
fi

# Verificar se EAS CLI está instalado
echo "🔍 Verificando EAS CLI..."
if command -v eas &> /dev/null; then
    EAS_VERSION=$(eas --version)
    echo "✅ EAS CLI encontrado: $EAS_VERSION"
else
    echo "⚠️  EAS CLI não encontrado. Instalando..."
    npm install -g @expo/eas-cli
fi

# Verificar se está logado no EAS
echo "🔍 Verificando login EAS..."
if eas whoami &> /dev/null; then
    WHOAMI=$(eas whoami)
    echo "✅ Logado como: $WHOAMI"
else
    echo "⚠️  Não está logado no EAS. Fazendo login..."
    echo "   Abra o navegador para fazer login..."
    eas login
fi

echo ""
echo "📦 Iniciando build APK..."
echo "   Plataforma: Android"
echo "   Perfil: preview"
echo "   Tipo: APK"
echo ""

# Executar build
echo "⏳ Aguarde... O build pode levar 5-15 minutos..."
echo ""

if eas build --platform android --profile preview --non-interactive; then
    echo ""
    echo "🎉 Build concluído com sucesso!"
    echo ""
    echo "📱 Próximos passos:"
    echo "   1. Acesse o link fornecido acima para baixar o APK"
    echo "   2. No seu Android, vá em Configurações > Segurança"
    echo "   3. Habilite 'Fontes desconhecidas' ou 'Instalar apps desconhecidos'"
    echo "   4. Baixe e instale o APK no seu dispositivo"
    echo ""
    echo "💡 Dica: O APK ficará disponível por 30 dias no Expo"
else
    echo ""
    echo "❌ Erro durante o build"
    echo ""
    echo "🔧 Possíveis soluções:"
    echo "   - Verifique sua conexão com a internet"
    echo "   - Execute: eas login"
    echo "   - Verifique se o projeto está configurado corretamente"
    echo "   - Consulte a documentação: frontend/BUILD_APK.md"
fi

echo ""
echo "📚 Para mais informações, consulte: frontend/BUILD_APK.md"

