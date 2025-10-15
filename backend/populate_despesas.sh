#!/bin/bash
# Script bash para popular despesas iniciais
# Execute: ./populate_despesas.sh

echo "🚀 Iniciando população de despesas..."

# Verificar se estamos no diretório correto
if [ ! -f "manage.py" ]; then
    echo "❌ Execute este script no diretório backend/"
    exit 1
fi

# Ativar ambiente virtual se existir
if [ -f "venv/bin/activate" ]; then
    echo "🔧 Ativando ambiente virtual..."
    source venv/bin/activate
fi

# Executar migrações primeiro
echo "📦 Executando migrações..."
python manage.py makemigrations
python manage.py migrate

# Popular despesas
echo "💰 Populando despesas..."
python manage.py populate_despesas

echo "✅ Processo concluído!"
echo "📱 Agora você pode acessar o app e ver as despesas pré-cadastradas"
