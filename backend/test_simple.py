#!/usr/bin/env python
"""
Script de teste simples para verificar se as rotas estão funcionando
"""
import os
import sys
import django

# Adicionar o diretório do projeto ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

def test_simple():
    """Testa se o Django está funcionando"""
    try:
        from django.conf import settings
        from django.urls import get_resolver
        
        print("=== Teste Simples do Django ===\n")
        
        # Verificar se as configurações estão carregadas
        print(f"✓ Django está configurado")
        print(f"  - DEBUG: {settings.DEBUG}")
        print(f"  - DATABASE: {settings.DATABASES['default']['ENGINE']}")
        print(f"  - INSTALLED_APPS: {len(settings.INSTALLED_APPS)} apps")
        
        # Verificar se as URLs estão configuradas
        resolver = get_resolver()
        print(f"✓ URLs estão configuradas")
        
        # Verificar se o app está instalado
        if 'registro_entregadespesa' in settings.INSTALLED_APPS:
            print(f"✓ App 'registro_entregadespesa' está instalado")
        else:
            print(f"✗ App 'registro_entregadespesa' NÃO está instalado")
        
        # Verificar se o app 'usuarios' está instalado
        if 'usuarios' in settings.INSTALLED_APPS:
            print(f"✓ App 'usuarios' está instalado")
        else:
            print(f"✗ App 'usuarios' NÃO está instalado")
        
        print("\n=== Configurações de CORS ===")
        print(f"  - CORS_ALLOW_ALL_ORIGINS: {getattr(settings, 'CORS_ALLOW_ALL_ORIGINS', 'N/A')}")
        print(f"  - CORS_ALLOWED_ORIGINS: {getattr(settings, 'CORS_ALLOWED_ORIGINS', 'N/A')}")
        
        print("\n=== Teste de Importação dos Modelos ===")
        try:
            from registro_entregadespesa.models import RegistroTrabalho, Despesa
            print(f"✓ Modelos importados com sucesso")
        except Exception as e:
            print(f"✗ Erro ao importar modelos: {e}")
        
        try:
            from usuarios.models import Entregador
            print(f"✓ Modelo Entregador importado com sucesso")
        except Exception as e:
            print(f"✗ Erro ao importar modelo Entregador: {e}")
        
        print("\n=== Teste de Conexão com Banco ===")
        try:
            from django.db import connection
            cursor = connection.cursor()
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            print(f"✓ Conexão com banco OK: {result[0]}")
        except Exception as e:
            print(f"✗ Erro na conexão com banco: {e}")
        
        print("\n=== Fim do Teste ===")
        
    except Exception as e:
        print(f"✗ Erro geral: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_simple()
