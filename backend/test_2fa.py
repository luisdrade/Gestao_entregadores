#!/usr/bin/env python
"""
Script para testar os endpoints do 2FA
"""
import os
import sys
import django
import requests
import json

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

from django.contrib.auth import get_user_model
from usuarios.email_service import TwoFactorEmailService

User = get_user_model()

def test_2fa_setup():
    """Testa o setup do 2FA"""
    print("🧪 Testando setup do 2FA...")
    
    # Buscar um usuário para teste
    try:
        user = User.objects.first()
        if not user:
            print("❌ Nenhum usuário encontrado no banco de dados")
            return False
        
        print(f"👤 Usando usuário: {user.email}")
        
        # Testar envio de código
        result = TwoFactorEmailService.send_2fa_code(user, 'setup')
        
        if result['success']:
            print("✅ Código 2FA enviado com sucesso!")
            print(f"📧 Email: {user.email}")
            print(f"⏰ Expira em: {result.get('expires_at', 'N/A')}")
            return True
        else:
            print(f"❌ Erro ao enviar código: {result['message']}")
            return False
            
    except Exception as e:
        print(f"❌ Erro no teste: {str(e)}")
        return False

def test_2fa_verify():
    """Testa a verificação do código 2FA"""
    print("\n🧪 Testando verificação do 2FA...")
    
    try:
        user = User.objects.first()
        if not user:
            print("❌ Nenhum usuário encontrado")
            return False
        
        # Simular código de teste
        test_code = "123456"
        
        # Criar um código de verificação manualmente para teste
        from usuarios.models import TwoFactorVerification
        from django.utils import timezone
        from datetime import timedelta
        
        verification = TwoFactorVerification.objects.create(
            user=user,
            code=test_code,
            expires_at=timezone.now() + timedelta(minutes=10),
            purpose='setup'
        )
        
        # Testar verificação
        result = TwoFactorEmailService.verify_code(user, test_code, 'setup')
        
        if result['success']:
            print("✅ Código 2FA verificado com sucesso!")
            return True
        else:
            print(f"❌ Erro na verificação: {result['message']}")
            return False
            
    except Exception as e:
        print(f"❌ Erro no teste: {str(e)}")
        return False

def test_email_templates():
    """Testa se os templates de email estão funcionando"""
    print("\n🧪 Testando templates de email...")
    
    try:
        from django.template.loader import render_to_string
        
        # Testar template de setup
        context = {
            'user_name': 'João Silva',
            'code': '123456',
            'expires_in': 10
        }
        
        html = render_to_string('emails/2fa_setup.html', context)
        
        if 'João Silva' in html and '123456' in html:
            print("✅ Template de setup funcionando!")
        else:
            print("❌ Template de setup com problema")
            return False
        
        # Testar template de login
        html = render_to_string('emails/2fa_login.html', context)
        
        if 'João Silva' in html and '123456' in html:
            print("✅ Template de login funcionando!")
        else:
            print("❌ Template de login com problema")
            return False
        
        # Testar template de disable
        html = render_to_string('emails/2fa_disable.html', context)
        
        if 'João Silva' in html and '123456' in html:
            print("✅ Template de disable funcionando!")
        else:
            print("❌ Template de disable com problema")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Erro no teste de templates: {str(e)}")
        return False

def main():
    """Executa todos os testes"""
    print("🚀 Iniciando testes do sistema 2FA...\n")
    
    tests = [
        test_email_templates,
        test_2fa_setup,
        test_2fa_verify,
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print(f"📊 Resultado: {passed}/{total} testes passaram")
    
    if passed == total:
        print("🎉 Todos os testes passaram! Sistema 2FA funcionando.")
    else:
        print("⚠️ Alguns testes falharam. Verifique os logs acima.")

if __name__ == "__main__":
    main()

