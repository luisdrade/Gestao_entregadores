#!/usr/bin/env python
"""
Script para migrar dados do banco local para banco na nuvem
Execute: python migrate_data.py
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

from django.core.management import call_command
from django.db import connection
from django.conf import settings

def export_data():
    """Exporta dados do banco local"""
    print("📤 Exportando dados do banco local...")
    
    # Criar diretório para exports
    os.makedirs('data_exports', exist_ok=True)
    
    # Exportar dados de cada app
    apps = ['usuarios', 'cadastro_veiculo', 'comunidade', 'registro_entregadespesa']
    
    for app in apps:
        try:
            print(f"  📦 Exportando {app}...")
            call_command('dumpdata', app, 
                        output=f'data_exports/{app}_data.json',
                        indent=2)
            print(f"  ✅ {app} exportado com sucesso")
        except Exception as e:
            print(f"  ⚠️ Erro ao exportar {app}: {e}")
    
    print("✅ Exportação concluída!")

def import_data():
    """Importa dados para o banco na nuvem"""
    print("📥 Importando dados para banco na nuvem...")
    
    # Verificar se estamos conectados ao banco na nuvem
    if not os.getenv('DATABASE_URL') and not os.getenv('DB_HOST'):
        print("❌ Configure as variáveis de ambiente do banco na nuvem primeiro!")
        return
    
    # Executar migrações primeiro
    print("🔄 Executando migrações...")
    call_command('migrate')
    
    # Importar dados
    for app in ['usuarios', 'cadastro_veiculo', 'comunidade', 'registro_entregadespesa']:
        json_file = f'data_exports/{app}_data.json'
        if os.path.exists(json_file):
            try:
                print(f"  📦 Importando {app}...")
                call_command('loaddata', json_file)
                print(f"  ✅ {app} importado com sucesso")
            except Exception as e:
                print(f"  ⚠️ Erro ao importar {app}: {e}")
        else:
            print(f"  ⚠️ Arquivo {json_file} não encontrado")
    
    print("✅ Importação concluída!")

def create_superuser():
    """Cria superusuário no banco na nuvem"""
    print("👤 Criando superusuário...")
    try:
        call_command('createsuperuser')
        print("✅ Superusuário criado com sucesso!")
    except Exception as e:
        print(f"⚠️ Erro ao criar superusuário: {e}")

def main():
    print("🚀 Script de Migração de Dados")
    print("=" * 40)
    
    if len(sys.argv) < 2:
        print("Uso: python migrate_data.py [export|import|superuser]")
        print("  export     - Exporta dados do banco local")
        print("  import     - Importa dados para banco na nuvem")
        print("  superuser  - Cria superusuário no banco na nuvem")
        return
    
    command = sys.argv[1]
    
    if command == 'export':
        export_data()
    elif command == 'import':
        import_data()
    elif command == 'superuser':
        create_superuser()
    else:
        print(f"❌ Comando '{command}' não reconhecido")
        print("Use: export, import ou superuser")

if __name__ == '__main__':
    main()
