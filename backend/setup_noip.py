#!/usr/bin/env python3
"""
Script para configurar automaticamente o NO-IP
Execute este script no servidor onde está rodando o Django
"""

import os
import requests
import time
from datetime import datetime

class NoIPUpdater:
    def __init__(self, username, password, hostname):
        self.username = username
        self.password = password
        self.hostname = hostname
        self.base_url = "http://dynupdate.no-ip.com/nic/update"
        
    def update_ip(self):
        """Atualiza o IP no NO-IP"""
        try:
            # Obtém o IP atual
            current_ip = requests.get('https://api.ipify.org').text
            
            # Faz a requisição para atualizar o NO-IP
            params = {
                'hostname': self.hostname,
                'myip': current_ip
            }
            
            response = requests.get(
                self.base_url,
                params=params,
                auth=(self.username, self.password)
            )
            
            if response.status_code == 200:
                result = response.text
                if result.startswith('good') or result.startswith('nochg'):
                    print(f"✅ IP atualizado com sucesso: {current_ip}")
                    return True
                else:
                    print(f"❌ Erro ao atualizar IP: {result}")
                    return False
            else:
                print(f"❌ Erro na requisição: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Erro: {e}")
            return False
    
    def run_continuous_update(self, interval=300):  # 5 minutos
        """Executa atualização contínua do IP"""
        print(f"🔄 Iniciando atualização contínua do NO-IP...")
        print(f"📡 Hostname: {self.hostname}")
        print(f"⏰ Intervalo: {interval} segundos")
        
        while True:
            self.update_ip()
            print(f"⏳ Próxima atualização em {interval} segundos...")
            time.sleep(interval)

def main():
    # Configurações do NO-IP
    NOIP_USERNAME = os.getenv('NOIP_USERNAME', 'seu_usuario')
    NOIP_PASSWORD = os.getenv('NOIP_PASSWORD', 'sua_senha')
    NOIP_HOSTNAME = os.getenv('NOIP_HOSTNAME', 'entregasplus.ddns.net')
    
    print("🚀 Configurador NO-IP para Gestão de Entregadores")
    print("=" * 50)
    
    # Solicita credenciais se não estiverem definidas
    if NOIP_USERNAME == 'seu_usuario':
        NOIP_USERNAME = input("Digite seu usuário NO-IP: ")
        NOIP_PASSWORD = input("Digite sua senha NO-IP: ")
        NOIP_HOSTNAME = input("Digite seu hostname NO-IP (ex: entregasplus.ddns.net): ")
    
    updater = NoIPUpdater(NOIP_USERNAME, NOIP_PASSWORD, NOIP_HOSTNAME)
    
    # Testa a conexão
    print("🧪 Testando conexão...")
    if updater.update_ip():
        print("✅ Conexão testada com sucesso!")
        
        # Pergunta se quer executar continuamente
        run_continuous = input("Deseja executar atualização contínua? (s/n): ").lower()
        if run_continuous == 's':
            updater.run_continuous_update()
        else:
            print("✅ Configuração única concluída!")
    else:
        print("❌ Falha na configuração. Verifique suas credenciais.")

if __name__ == "__main__":
    main()
