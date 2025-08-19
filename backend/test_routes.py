#!/usr/bin/env python
"""
Script de teste para verificar se as rotas estão funcionando
"""
import os
import sys
import django
from django.test import Client
from django.urls import reverse

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

def test_routes():
    """Testa se as rotas estão funcionando"""
    client = Client()
    
    print("=== Testando Rotas ===\n")
    
    # Testar rota raiz
    try:
        response = client.get('/')
        print(f"✓ Rota raiz (/): {response.status_code}")
        if response.status_code == 200:
            print(f"  Conteúdo: {response.json()}")
    except Exception as e:
        print(f"✗ Rota raiz (/): Erro - {e}")
    
    # Testar rota de teste de conexão
    try:
        response = client.get('/registro/test-connection/')
        print(f"✓ Rota teste (/registro/test-connection/): {response.status_code}")
        if response.status_code == 200:
            print(f"  Conteúdo: {response.json()}")
    except Exception as e:
        print(f"✗ Rota teste (/registro/test-connection/): Erro - {e}")
    
    # Testar rota de registro de trabalho
    try:
        response = client.get('/registro/registro-trabalho/')
        print(f"✓ Rota registro trabalho (/registro/registro-trabalho/): {response.status_code}")
    except Exception as e:
        print(f"✗ Rota registro trabalho (/registro/registro-trabalho/): Erro - {e}")
    
    # Testar rota de registro de despesa
    try:
        response = client.get('/registro/registro-despesa/')
        print(f"✓ Rota registro despesa (/registro/registro-despesa/): {response.status_code}")
    except Exception as e:
        print(f"✗ Rota registro despesa (/registro/registro-despesa/): Erro - {e}")
    
    # Testar rota de usuários
    try:
        response = client.get('/api/')
        print(f"✓ Rota usuários (/api/): {response.status_code}")
    except Exception as e:
        print(f"✗ Rota usuários (/api/): Erro - {e}")

if __name__ == '__main__':
    test_routes()
