#!/usr/bin/env python
"""
Teste simples para verificar se a URL da comunidade está funcionando
"""
import os
import sys
import django
from django.test import Client
from django.urls import reverse

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

def test_comunidade_url():
    """Testa se a URL da comunidade está funcionando"""
    client = Client()
    
    print("🔍 Testando URL da comunidade...")
    
    # Teste GET
    try:
        response = client.get('/comunidade/')
        print(f"✅ GET /comunidade/ - Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ URL da comunidade está funcionando!")
            return True
        else:
            print(f"❌ Erro: Status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao testar URL: {e}")
        return False

def test_comunidade_post():
    """Testa se o POST para criar postagem está funcionando"""
    client = Client()
    
    print("\n🔍 Testando POST para criar postagem...")
    
    # Dados de teste
    post_data = {
        'autor': 'Teste Python',
        'titulo': 'Teste de Postagem',
        'conteudo': 'Esta é uma postagem de teste criada via Python.',
        'submit_postagem': 'true'
    }
    
    try:
        response = client.post('/comunidade/', post_data)
        print(f"✅ POST /comunidade/ - Status: {response.status_code}")
        
        if response.status_code in [200, 302]:  # 302 é redirect após sucesso
            print("✅ POST para criar postagem está funcionando!")
            return True
        else:
            print(f"❌ Erro: Status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao testar POST: {e}")
        return False

if __name__ == '__main__':
    print("🚀 Iniciando testes da comunidade...")
    
    # Testar GET
    get_ok = test_comunidade_url()
    
    # Testar POST
    post_ok = test_comunidade_post()
    
    print(f"\n📊 Resultados:")
    print(f"GET /comunidade/: {'✅ OK' if get_ok else '❌ FALHOU'}")
    print(f"POST /comunidade/: {'✅ OK' if post_ok else '❌ FALHOU'}")
    
    if get_ok and post_ok:
        print("\n🎉 Todos os testes passaram! A comunidade está funcionando.")
    else:
        print("\n⚠️ Alguns testes falharam. Verifique a configuração.")

