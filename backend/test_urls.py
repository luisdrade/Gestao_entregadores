#!/usr/bin/env python
"""
Script de teste para verificar se as URLs estão funcionando
"""
import os
import sys
import django

# Adicionar o diretório do projeto ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

def test_urls():
    """Testa se as URLs estão funcionando"""
    try:
        from django.test import Client
        from django.urls import reverse, resolve
        
        print("=== Testando URLs ===\n")
        
        client = Client()
        
        # Testar rota raiz
        try:
            response = client.get('/')
            print(f"✓ Rota raiz (/): {response.status_code}")
            if response.status_code == 200:
                print(f"  Conteúdo: {response.json()}")
        except Exception as e:
            print(f"✗ Rota raiz (/): Erro - {e}")
        
        # Testar rota de teste da API
        try:
            response = client.get('/api/test/')
            print(f"✓ Rota teste API (/api/test/): {response.status_code}")
            if response.status_code == 200:
                print(f"  Conteúdo: {response.json()}")
        except Exception as e:
            print(f"✗ Rota teste API (/api/test/): Erro - {e}")
        
        # Testar rota de teste de conexão
        try:
            response = client.get('/registro/api/test-connection/')
            print(f"✓ Rota teste conexão (/registro/api/test-connection/): {response.status_code}")
            if response.status_code == 200:
                print(f"  Conteúdo: {response.json()}")
        except Exception as e:
            print(f"✗ Rota teste conexão (/registro/api/test-connection/): Erro - {e}")
        
        # Testar rota de registro de trabalho (GET para ver se existe)
        try:
            response = client.get('/registro/api/registro-trabalho/')
            print(f"✓ Rota registro trabalho (/registro/api/registro-trabalho/): {response.status_code}")
        except Exception as e:
            print(f"✗ Rota registro trabalho (/registro/api/registro-trabalho/): Erro - {e}")
        
        # Testar rota de registro de despesa (GET para ver se existe)
        try:
            response = client.get('/registro/api/registro-despesa/')
            print(f"✓ Rota registro despesa (/registro/api/registro-despesa/): {response.status_code}")
        except Exception as e:
            print(f"✗ Rota registro despesa (/registro/api/registro-despesa/): Erro - {e}")
        
        # Testar rota de usuários
        try:
            response = client.get('/api/')
            print(f"✓ Rota usuários (/api/): {response.status_code}")
        except Exception as e:
            print(f"✗ Rota usuários (/api/): Erro - {e}")
        
        print("\n=== Testando Resolução de URLs ===")
        
        # Testar se as URLs podem ser resolvidas
        try:
            url_patterns = [
                '/registro/api/test-connection/',
                '/registro/api/registro-trabalho/',
                '/registro/api/registro-despesa/',
            ]
            
            for url in url_patterns:
                try:
                    resolved = resolve(url)
                    print(f"✓ URL {url} resolve para: {resolved.func.__name__}")
                except Exception as e:
                    print(f"✗ URL {url} não pode ser resolvida: {e}")
        except Exception as e:
            print(f"✗ Erro ao testar resolução de URLs: {e}")
        
        print("\n=== Fim do Teste ===")
        
    except Exception as e:
        print(f"✗ Erro geral: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_urls()
