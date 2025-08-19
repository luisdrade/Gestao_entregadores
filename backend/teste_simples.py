#!/usr/bin/env python
"""
Script de teste simples para verificar se as URLs estão funcionando
"""
import os
import sys
import django

# Configurar o ambiente Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')

# Configurar Django
django.setup()

def test_simple():
    """Testa se o Django está funcionando"""
    try:
        from django.test import Client
        from django.urls import resolve
        from django.conf import settings
        
        print("=== Teste Simples Django ===\n")
        
        # Verificar configurações
        print(f"✓ Django configurado - DEBUG: {settings.DEBUG}")
        print(f"✓ Database: {settings.DATABASES['default']['ENGINE']}")
        
        # Testar client
        client = Client()
        
        # Testar rota raiz
        try:
            response = client.get('/')
            print(f"✓ Rota raiz (/): Status {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"  Message: {data.get('message', 'N/A')}")
        except Exception as e:
            print(f"✗ Erro na rota raiz: {e}")
        
        # Testar rota de teste de conexão
        try:
            response = client.get('/registro/api/test-connection/')
            print(f"✓ Rota test-connection: Status {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"  Message: {data.get('message', 'N/A')}")
        except Exception as e:
            print(f"✗ Erro na rota test-connection: {e}")
        
        # Testar rota de registro de trabalho
        try:
            response = client.get('/registro/api/registro-trabalho/')
            print(f"✓ Rota registro-trabalho: Status {response.status_code}")
            # Status 405 = Method Not Allowed (GET não permitido, mas POST sim)
            if response.status_code == 405:
                print("  ✓ Endpoint existe (405 = Method Not Allowed para GET)")
            elif response.status_code == 200:
                data = response.json()
                print(f"  Message: {data.get('message', 'N/A')}")
        except Exception as e:
            print(f"✗ Erro na rota registro-trabalho: {e}")
        
        # Testar resolução de URLs
        print("\n=== Teste de Resolução de URLs ===")
        urls_to_test = [
            '/registro/api/test-connection/',
            '/registro/api/registro-trabalho/',
            '/registro/api/registro-despesa/',
        ]
        
        for url in urls_to_test:
            try:
                resolved = resolve(url)
                print(f"✓ {url} -> {resolved.func.__name__}")
            except Exception as e:
                print(f"✗ {url} -> Erro: {e}")
        
        print("\n=== Fim do Teste ===")
        
    except Exception as e:
        print(f"✗ Erro geral: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_simple()