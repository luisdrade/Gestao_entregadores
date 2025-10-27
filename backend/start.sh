#!/usr/bin/env bash
# Script de inicialização para o Render

echo "🚀 Starting EntregasPlus Backend..."

# Executar migrações
echo "📦 Running migrations..."
python manage.py migrate --noinput

# Coletar arquivos estáticos
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Iniciar Gunicorn
echo "✅ Starting Gunicorn..."
gunicorn sistema.wsgi:application

