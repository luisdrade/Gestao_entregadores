#!/usr/bin/env python3
"""
Script para testar a API no Render
Execute: python test_render_api.py
"""

import requests
import json

# URL do backend no Render
BACKEND_URL = "https://gestao-entregadores-backend.onrender.com"

def test_health():
    """Teste básico de health check"""
    print("🏥 Testando Health Check...")
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        print(f"✅ Status: {response.status_code}")
        print(f"📝 Response: {response.text}")
        return True
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_api_root():
    """Teste do endpoint raiz da API"""
    print("\n🌐 Testando API Root...")
    try:
        response = requests.get(f"{BACKEND_URL}/api/", timeout=10)
        print(f"✅ Status: {response.status_code}")
        print(f"📝 Response: {response.text}")
        return True
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_registration(data):
    """Teste de registro de usuário"""
    print("\n📝 Testando Registro de Usuário...")
    try:
        headers = {
            'Content-Type': 'application/json',
            'X-App-Source': 'mobile-app'
        }
        response = requests.post(
            f"{BACKEND_URL}/api/auth/register/",
            json=data,
            headers=headers,
            timeout=15
        )
        print(f"✅ Status: {response.status_code}")
        print(f"📝 Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code in [200, 201, 400]  # 400 = dados inválidos (ok)
    except Exception as e:
        print(f"❌ Erro: {e}")
        if hasattr(e, 'response'):
            print(f"📝 Response: {e.response.text}")
        return False

def main():
    print("🚀 Testando API no Render")
    print("=" * 50)
    
    # Teste 1: Health Check
    health_ok = test_health()
    
    # Teste 2: API Root
    api_ok = test_api_root()
    
    # Teste 3: Registro (com dados de teste)
    test_data = {
        "nome": "Teste Usuario",
        "username": f"teste_{hash('teste') % 10000}",
        "email": f"teste{hash('teste') % 10000}@example.com",
        "telefone": "(11) 99999-9999",
        "password": "Teste123!",
        "password_confirm": "Teste123!"
    }
    register_ok = test_registration(test_data)
    
    # Resumo
    print("\n" + "=" * 50)
    print("📊 Resumo dos Testes:")
    print(f"   Health Check: {'✅' if health_ok else '❌'}")
    print(f"   API Root: {'✅' if api_ok else '❌'}")
    print(f"   Registro: {'✅' if register_ok else '❌'}")
    print("=" * 50)
    
    if health_ok and api_ok:
        print("\n🎉 API está funcionando!")
    else:
        print("\n⚠️ API com problemas. Verifique os logs no Render.")

if __name__ == "__main__":
    main()

