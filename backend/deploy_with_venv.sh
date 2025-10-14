#!/bin/bash

# Script de Deploy com Ambiente Virtual (Bash)
# Uso: ./deploy_with_venv.sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VENV_PATH=${1:-"venv"}

echo -e "${GREEN}🚀 Iniciando deploy com ambiente virtual...${NC}"

# Verificar se o ambiente virtual existe
if [ ! -d "$VENV_PATH" ]; then
    echo -e "${RED}❌ Ambiente virtual não encontrado em: $VENV_PATH${NC}"
    echo -e "${YELLOW}💡 Crie o ambiente virtual primeiro com: python -m venv venv${NC}"
    exit 1
fi

# Ativar ambiente virtual
echo -e "${GREEN}🔧 Ativando ambiente virtual...${NC}"
source "$VENV_PATH/bin/activate"

# Verificar se o Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Railway CLI...${NC}"
    npm install -g @railway/cli
fi

# Verificar se está logado no Railway
echo -e "${GREEN}🔐 Verificando login no Railway...${NC}"
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}🔑 Fazendo login no Railway...${NC}"
    railway login
fi

# Verificar se o projeto está inicializado
if [ ! -d ".railway" ]; then
    echo -e "${GREEN}🏗️ Inicializando projeto no Railway...${NC}"
    railway init
fi

# Verificar se o MySQL está adicionado
echo -e "${GREEN}🗄️ Verificando banco MySQL...${NC}"
if ! railway status 2>/dev/null | grep -q "mysql"; then
    echo -e "${YELLOW}📊 Adicionando banco MySQL...${NC}"
    railway add mysql
fi

# Configurar variáveis de ambiente
echo -e "${GREEN}⚙️ Configurando variáveis de ambiente...${NC}"

# Solicitar informações do usuário
read -p "Digite sua DJANGO_SECRET_KEY (ou pressione Enter para gerar uma): " secret_key
if [ -z "$secret_key" ]; then
    secret_key=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-50)
    echo -e "${YELLOW}🔑 Chave secreta gerada: ${secret_key:0:20}...${NC}"
fi

read -p "Digite o nome do seu app no Railway (ex: gestao-entregadores): " app_name

# Configurar variáveis
railway variables set DJANGO_SECRET_KEY="$secret_key"
railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS="$app_name.railway.app,localhost,127.0.0.1"
railway variables set STATIC_URL="/static/"
railway variables set STATIC_ROOT="/app/staticfiles"
railway variables set MEDIA_URL="/media/"
railway variables set MEDIA_ROOT="/app/media"

# Fazer deploy
echo -e "${GREEN}🚀 Fazendo deploy...${NC}"
railway up

# Aguardar um pouco para o deploy
echo -e "${YELLOW}⏳ Aguardando deploy...${NC}"
sleep 10

# Executar migrações
echo -e "${GREEN}🗄️ Executando migrações...${NC}"
railway run python manage.py migrate

# Coletar arquivos estáticos
echo -e "${GREEN}📁 Coletando arquivos estáticos...${NC}"
railway run python manage.py collectstatic --noinput

# Criar superusuário
echo -e "${GREEN}👤 Criando superusuário...${NC}"
echo -e "${YELLOW}💡 Siga as instruções para criar o superusuário:${NC}"
railway run python manage.py createsuperuser

# Abrir aplicação
echo -e "${GREEN}🌐 Abrindo aplicação...${NC}"
railway open

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo -e "${GREEN}🔗 Sua aplicação está disponível em: https://$app_name.railway.app${NC}"
echo -e "${GREEN}👨‍💼 Admin Django: https://$app_name.railway.app/admin/${NC}"

