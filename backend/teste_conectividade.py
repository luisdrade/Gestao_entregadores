#!/usr/bin/env python3
"""
Script para testar a conectividade do backend Django
"""

import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

def test_server():
    """Testa se o servidor Django está funcionando"""
    try:
        from django.http import HttpRequest
        from django.test import Client
        
        client = Client()
        
        # Testar endpoint raiz
        response = client.get('/')
        print(f"✅ Endpoint raiz: {response.status_code} - {response.json()}")
        
        # Testar endpoint de teste da API
        response = client.get('/api/test/')
        print(f"✅ Endpoint API test: {response.status_code} - {response.json()}")
        
        # Testar endpoint de conexão com banco
        response = client.get('/registro/api/test-connection/')
        print(f"✅ Endpoint test-connection: {response.status_code} - {response.json()}")
        
        # Testar endpoint do dashboard (sem autenticação)
        response = client.get('/registro/api/dashboard-data/')
        print(f"✅ Endpoint dashboard (sem auth): {response.status_code}")
        
        print("\n🎉 Todos os endpoints estão funcionando!")
        
    except Exception as e:
        print(f"❌ Erro ao testar servidor: {e}")
        return False
    
    return True

def test_database():
    """Testa a conexão com o banco de dados"""
    try:
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        print(f"✅ Conexão com banco: OK - Resultado: {result[0]}")
        return True
    except Exception as e:
        print(f"❌ Erro na conexão com banco: {e}")
        return False

def test_models():
    """Testa se os modelos estão funcionando"""
    try:
        from usuarios.models import Entregador
        from registro_entregadespesa.models import RegistroTrabalho, Despesa
        
        # Contar registros
        entregadores = Entregador.objects.count()
        registros = RegistroTrabalho.objects.count()
        despesas = Despesa.objects.count()
        
        print(f"✅ Modelos funcionando:")
        print(f"   - Entregadores: {entregadores}")
        print(f"   - Registros de trabalho: {registros}")
        print(f"   - Despesas: {despesas}")
        
        return True
    except Exception as e:
        print(f"❌ Erro nos modelos: {e}")
        return False

if __name__ == '__main__':
    print("🔍 Testando conectividade do backend Django...\n")
    
    # Testar banco de dados
    db_ok = test_database()
    
    # Testar modelos
    models_ok = test_models()
    
    # Testar servidor
    server_ok = test_server()
    
    print("\n" + "="*50)
    if all([db_ok, models_ok, server_ok]):
        print("🎉 Backend está funcionando perfeitamente!")
        print("🌐 Servidor pode ser acessado em: http://localhost:8000")
        print("📱 Frontend pode conectar usando: http://172.18.128.1:8000")
    else:
        print("❌ Há problemas no backend que precisam ser resolvidos")
    print("="*50)
