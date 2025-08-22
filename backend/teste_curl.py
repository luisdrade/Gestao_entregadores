#!/usr/bin/env python3
"""
Teste usando requests para simular o frontend
"""

import requests
import json

def test_endpoints():
    """Testa os endpoints da API"""
    
    # URL base
    base_url = "http://172.18.128.1:8000"
    
    print("=== Testando Endpoints da API ===")
    
    # Lista de endpoints para testar
    endpoints = [
        {
            'name': 'Teste Dashboard',
            'url': f'{base_url}/registro/api/test-dashboard/',
            'method': 'GET'
        },
        {
            'name': 'Dashboard Data (Mês)',
            'url': f'{base_url}/registro/api/dashboard-data/?periodo=mes',
            'method': 'GET'
        },
        {
            'name': 'Dashboard Data (Semana)',
            'url': f'{base_url}/registro/api/dashboard-data/?periodo=semana',
            'method': 'GET'
        },
        {
            'name': 'Test Connection',
            'url': f'{base_url}/registro/api/test-connection/',
            'method': 'GET'
        }
    ]
    
    for endpoint in endpoints:
        print(f"\n--- Testando: {endpoint['name']} ---")
        print(f"URL: {endpoint['url']}")
        print(f"Método: {endpoint['method']}")
        
        try:
            if endpoint['method'] == 'GET':
                response = requests.get(endpoint['url'], timeout=10)
            else:
                response = requests.post(endpoint['url'], timeout=10)
            
            print(f"Status Code: {response.status_code}")
            print(f"Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"✅ Resposta JSON: {json.dumps(data, indent=2, ensure_ascii=False)}")
                except:
                    print(f"✅ Resposta Texto: {response.text[:200]}...")
            else:
                print(f"❌ Erro: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Erro de conexão - Servidor não está rodando")
        except requests.exceptions.Timeout:
            print("❌ Timeout - Servidor demorou para responder")
        except Exception as e:
            print(f"❌ Erro inesperado: {e}")
    
    print("\n=== Fim dos Testes ===")

if __name__ == "__main__":
    test_endpoints()
