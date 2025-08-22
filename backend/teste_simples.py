#!/usr/bin/env python3
"""
Teste simples para verificar se o endpoint do dashboard está funcionando
"""

import requests

# URL base da API
BASE_URL = "http://172.18.128.1:8000"

def test_simple():
    """Teste simples de conexão"""
    
    print("=== Teste Simples de Conexão ===")
    
    # Teste 1: Endpoint de teste do dashboard
    try:
        print("\n1. Testando endpoint de teste...")
        response = requests.get(f"{BASE_URL}/registro/api/test-dashboard/")
        
        print(f"   Status Code: {response.status_code}")
        print(f"   URL: {response.url}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Resposta: {data}")
        else:
            print(f"   ❌ Erro: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Erro de conexão - Servidor não está rodando")
    except Exception as e:
        print(f"   ❌ Erro inesperado: {e}")
    
    # Teste 2: Endpoint principal do dashboard
    try:
        print("\n2. Testando dashboard principal...")
        response = requests.get(f"{BASE_URL}/registro/api/dashboard-data/?periodo=mes")
        
        print(f"   Status Code: {response.status_code}")
        print(f"   URL: {response.url}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Resposta: {data}")
        else:
            print(f"   ❌ Erro: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Erro de conexão - Servidor não está rodando")
    except Exception as e:
        print(f"   ❌ Erro inesperado: {e}")

if __name__ == "__main__":
    test_simple()