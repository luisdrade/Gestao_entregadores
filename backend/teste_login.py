#!/usr/bin/env python3
"""
Script para testar o endpoint de login
"""

import os
import sys
import django
import json

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

def test_login_endpoint():
    """Testa o endpoint de login"""
    try:
        from usuarios.models import Entregador
        
        # Verificar se há entregadores cadastrados
        entregadores = Entregador.objects.all()
        print(f"🔍 Entregadores cadastrados: {entregadores.count()}")
        
        for entregador in entregadores[:3]:  # Mostrar os primeiros 3
            print(f"   - ID: {entregador.id}, Nome: {entregador.nome}, Email: {entregador.email}")
        
        if entregadores.count() == 0:
            print("❌ Nenhum entregador cadastrado! Crie um primeiro.")
            return False
        
        # Pegar o primeiro entregador para teste
        entregador = entregadores.first()
        
        # Testar login com credenciais válidas
        print(f"\n🔍 Testando login com: {entregador.email}")
        
        # Simular requisição POST para login
        from django.test import Client
        client = Client()
        
        response = client.post('/api/auth/login/', {
            'email': entregador.email,
            'password': 'teste123'  # Senha padrão para teste
        })
        
        print(f"📊 Status da resposta: {response.status_code}")
        print(f"📊 Conteúdo da resposta: {response.content.decode()}")
        
        if response.status_code == 200:
            print("✅ Login funcionando!")
            return True
        else:
            print("❌ Login falhou!")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao testar login: {e}")
        return False

def test_jwt_token():
    """Testa se o JWT está funcionando"""
    try:
        from rest_framework_simplejwt.tokens import RefreshToken
        from usuarios.models import Entregador
        
        entregador = Entregador.objects.first()
        if not entregador:
            print("❌ Nenhum entregador para testar JWT")
            return False
        
        # Gerar token JWT
        refresh = RefreshToken.for_user(entregador)
        access_token = str(refresh.access_token)
        
        print(f"🔍 JWT Token gerado: {access_token[:50]}...")
        print(f"🔍 Token válido: {len(access_token) > 0}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao gerar JWT: {e}")
        return False

if __name__ == '__main__':
    print("🔍 Testando sistema de autenticação...\n")
    
    # Testar JWT
    jwt_ok = test_jwt_token()
    
    # Testar endpoint de login
    login_ok = test_login_endpoint()
    
    print("\n" + "="*50)
    if all([jwt_ok, login_ok]):
        print("🎉 Sistema de autenticação funcionando!")
    else:
        print("❌ Há problemas no sistema de autenticação")
    print("="*50)
