#!/usr/bin/env python3
"""
Script para testar a API de estatísticas
"""

import os
import django
import requests

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

def testar_api_estatisticas():
    """Testa a API de estatísticas"""
    try:
        # URL da API
        url = 'http://localhost:8000/api/usuarios/estatisticas/'
        
        # Fazer requisição GET
        response = requests.get(url)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ API funcionando!")
        else:
            print("❌ API com problema")
            
    except Exception as e:
        print(f"❌ Erro ao testar API: {e}")

if __name__ == '__main__':
    print("🧪 Testando API de estatísticas...\n")
    testar_api_estatisticas()
