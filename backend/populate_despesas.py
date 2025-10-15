#!/usr/bin/env python
"""
Script para popular o banco de dados com despesas iniciais
Execute: python populate_despesas.py
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

from django.core.management import call_command

def main():
    print("🚀 Iniciando população de despesas...")
    
    try:
        # Executar o comando de popular despesas
        call_command('populate_despesas')
        print("\n✅ Despesas populadas com sucesso!")
        print("\n📊 Resumo:")
        print("   - Despesas iniciais criadas para todos os entregadores")
        print("   - Categorias personalizadas criadas")
        print("   - Dados de exemplo com valores realistas")
        
    except Exception as e:
        print(f"❌ Erro ao popular despesas: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
