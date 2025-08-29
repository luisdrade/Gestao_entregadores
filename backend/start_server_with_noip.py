#!/usr/bin/env python3
"""
Script para iniciar o servidor Django com atualização automática do NO-IP
"""

import os
import sys
import subprocess
import threading
import time
from setup_noip import NoIPUpdater

def start_django_server():
    """Inicia o servidor Django"""
    print("🚀 Iniciando servidor Django...")
    try:
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'
        ], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Servidor Django interrompido")
    except Exception as e:
        print(f"❌ Erro ao iniciar servidor Django: {e}")

def start_noip_updater():
    """Inicia o atualizador NO-IP em background"""
    print("📡 Iniciando atualizador NO-IP...")
    
    # Configurações do NO-IP
    username = os.getenv('NOIP_USERNAME', 'seu_usuario')
    password = os.getenv('NOIP_PASSWORD', 'sua_senha')
    hostname = os.getenv('NOIP_HOSTNAME', 'entregasplus.ddns.net')
    
    if username == 'seu_usuario':
        print("⚠️  Configure as variáveis de ambiente NO-IP primeiro!")
        print("   NOIP_USERNAME, NOIP_PASSWORD, NOIP_HOSTNAME")
        return
    
    updater = NoIPUpdater(username, password, hostname)
    
    # Atualiza o IP a cada 5 minutos
    while True:
        try:
            updater.update_ip()
            time.sleep(300)  # 5 minutos
        except Exception as e:
            print(f"❌ Erro no atualizador NO-IP: {e}")
            time.sleep(60)  # Espera 1 minuto antes de tentar novamente

def main():
    print("🎯 Gestão de Entregadores - Servidor com NO-IP")
    print("=" * 50)
    
    # Verifica se estamos no diretório correto
    if not os.path.exists('manage.py'):
        print("❌ Execute este script no diretório do projeto Django")
        sys.exit(1)
    
    # Inicia o atualizador NO-IP em uma thread separada
    noip_thread = threading.Thread(target=start_noip_updater, daemon=True)
    noip_thread.start()
    
    # Aguarda um pouco para o NO-IP se conectar
    time.sleep(2)
    
    # Inicia o servidor Django
    start_django_server()

if __name__ == "__main__":
    main()
