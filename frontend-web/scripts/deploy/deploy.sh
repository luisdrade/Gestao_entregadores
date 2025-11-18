#!/bin/bash

# Script de Deploy Automatizado para Frontend
# Uso: ./deploy.sh [vercel|netlify|railway]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando deploy do frontend...${NC}"

# Verificar se o arquivo .env.local existe
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env.local não encontrado. Criando a partir do exemplo...${NC}"
    cp env.example .env.local
    echo -e "${RED}❌ Por favor, edite o arquivo .env.local com suas configurações antes de continuar.${NC}"
    exit 1
fi

# Verificar se a URL da API está configurada
if ! grep -q "VITE_API_BASE_URL" .env.local || grep -q "seu-backend.railway.app" .env.local; then
    echo -e "${RED}❌ Por favor, configure a VITE_API_BASE_URL no arquivo .env.local${NC}"
    exit 1
fi

# Instalar dependências
echo -e "${GREEN}📦 Instalando dependências...${NC}"
npm install

# Build do projeto
echo -e "${GREEN}🔨 Fazendo build do projeto...${NC}"
npm run build

# Deploy baseado no argumento
case "${1:-vercel}" in
    "vercel")
        echo -e "${GREEN}🚀 Fazendo deploy no Vercel...${NC}"
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}📦 Instalando Vercel CLI...${NC}"
            npm i -g vercel
        fi
        vercel --prod
        ;;
    "netlify")
        echo -e "${GREEN}🚀 Fazendo deploy no Netlify...${NC}"
        if ! command -v netlify &> /dev/null; then
            echo -e "${YELLOW}📦 Instalando Netlify CLI...${NC}"
            npm i -g netlify-cli
        fi
        netlify deploy --prod
        ;;
    "railway")
        echo -e "${GREEN}🚀 Fazendo deploy no Railway...${NC}"
        if ! command -v railway &> /dev/null; then
            echo -e "${YELLOW}📦 Instalando Railway CLI...${NC}"
            npm i -g @railway/cli
        fi
        railway up
        ;;
    *)
        echo -e "${RED}❌ Plataforma não suportada. Use: vercel, netlify ou railway${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo -e "${YELLOW}💡 Lembre-se de configurar as variáveis de ambiente na plataforma escolhida.${NC}"

