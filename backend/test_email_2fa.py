#!/usr/bin/env python
"""
Script para testar configuração de email do 2FA pós-cadastro
"""
import os
import sys
import django

# Adicionar o diretório do projeto ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

from usuarios.email_service import TwoFactorEmailService
from usuarios.models import Entregador
from email_config import EmailConfig

def test_email_config():
    """Testa a configuração de email"""
    print("🔧 Testando configuração de email...")
    print("=" * 50)
    
    # Testar configuração
    result = EmailConfig.test_email_connection()
    
    print(f"✅ Status: {'SUCESSO' if result['success'] else 'FALHA'}")
    print(f"📧 Mensagem: {result['message']}")
    print("\n📋 Configuração atual:")
    for key, value in result['config'].items():
        if 'PASSWORD' in key:
            print(f"   {key}: {'*' * len(str(value)) if value else 'NÃO DEFINIDO'}")
        else:
            print(f"   {key}: {value}")
    
    return result['success']

def test_registration_email():
    """Testa envio de email de verificação pós-cadastro"""
    print("\n📧 Testando envio de email de verificação...")
    print("=" * 50)
    
    try:
        # Pegar o primeiro usuário ou criar um de teste
        user = Entregador.objects.first()
        
        if not user:
            print("❌ Nenhum usuário encontrado. Crie um usuário primeiro.")
            return False
        
        print(f"👤 Testando com usuário: {user.email}")
        
        # Enviar código de verificação
        result = TwoFactorEmailService.send_registration_code(user)
        
        if result['success']:
            print("✅ Email enviado com sucesso!")
            print(f"📅 Expira em: {result['expires_at']}")
            print(f"🔑 Código gerado: {user.registration_code}")
            return True
        else:
            print(f"❌ Falha ao enviar email: {result['message']}")
            return False
            
    except Exception as e:
        print(f"❌ Erro: {str(e)}")
        return False

def main():
    """Função principal"""
    print("🚀 TESTE DE CONFIGURAÇÃO DE EMAIL 2FA")
    print("=" * 50)
    
    # Testar configuração
    config_ok = test_email_config()
    
    if not config_ok:
        print("\n❌ CONFIGURAÇÃO INCORRETA!")
        print("📖 Consulte o arquivo CONFIGURAR_EMAIL_2FA.md para configurar corretamente.")
        return
    
    # Testar envio de email
    email_ok = test_registration_email()
    
    if email_ok:
        print("\n🎉 SUCESSO! Email de verificação funcionando!")
        print("📧 Verifique sua caixa de entrada (e spam)")
        print("🔑 Use o código mostrado acima para testar a verificação")
    else:
        print("\n❌ FALHA! Verifique a configuração de email")

if __name__ == "__main__":
    main()
