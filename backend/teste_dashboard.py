#!/usr/bin/env python3
"""
Teste simples para a API do dashboard
"""

import requests
import json

# URL base da API
BASE_URL = "http://172.18.128.1:8000"

def test_dashboard_api():
    """Testa a API do dashboard"""
    
    print("=== Testando API do Dashboard ===")
    
    # Teste 1: Dashboard com período mensal
    try:
        print("\n1. Testando dashboard mensal...")
        response = requests.get(f"{BASE_URL}/registro/api/dashboard-data/?periodo=mes")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Dashboard mensal funcionando!")
                print(f"   Dados recebidos: {json.dumps(data['data'], indent=2, ensure_ascii=False)}")
            else:
                print(f"❌ Erro na API: {data.get('error', 'Erro desconhecido')}")
        else:
            print(f"❌ Status code: {response.status_code}")
            print(f"   Resposta: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Erro de conexão - Servidor não está rodando")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
    
    # Teste 2: Dashboard com período semanal
    try:
        print("\n2. Testando dashboard semanal...")
        response = requests.get(f"{BASE_URL}/registro/api/dashboard-data/?periodo=semana")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Dashboard semanal funcionando!")
                print(f"   Dados recebidos: {json.dumps(data['data'], indent=2, ensure_ascii=False)}")
            else:
                print(f"❌ Erro na API: {data.get('error', 'Erro desconhecido')}")
        else:
            print(f"❌ Status code: {response.status_code}")
            print(f"   Resposta: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Erro de conexão - Servidor não está rodando")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
    
    # Teste 3: Teste de conexão
    try:
        print("\n3. Testando conexão com banco...")
        response = requests.get(f"{BASE_URL}/registro/api/test-connection/")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Conexão com banco OK!")
                print(f"   Mensagem: {data.get('message')}")
            else:
                print(f"❌ Erro na conexão: {data.get('error', 'Erro desconhecido')}")
        else:
            print(f"❌ Status code: {response.status_code}")
            print(f"   Resposta: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Erro de conexão - Servidor não está rodando")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")

if __name__ == "__main__":
    test_dashboard_api()
