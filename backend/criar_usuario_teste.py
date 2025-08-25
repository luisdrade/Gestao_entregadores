#!/usr/bin/env python3
"""
Script para criar um usuário de teste
"""

import os
import django

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

def criar_usuario_teste():
    """Cria um usuário de teste para login"""
    try:
        from usuarios.models import Entregador
        
        # Verificar se já existe um usuário de teste
        email_teste = 'teste@teste.com'
        if Entregador.objects.filter(email=email_teste).exists():
            print(f"✅ Usuário de teste já existe: {email_teste}")
            return True
        
        # Criar usuário de teste
        usuario = Entregador.objects.create(
            nome='Usuário Teste',
            email=email_teste,
            cpf='999.888.777-66',  # CPF único
            telefone='(11) 99999-9999',
            username='usuario_teste'
        )
        
        # Definir senha
        usuario.set_password('123456')
        usuario.save()
        
        print(f"✅ Usuário de teste criado com sucesso!")
        print(f"   Email: {email_teste}")
        print(f"   Senha: 123456")
        print(f"   Nome: {usuario.nome}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar usuário: {e}")
        return False

if __name__ == '__main__':
    print("🔧 Criando usuário de teste...\n")
    
    if criar_usuario_teste():
        print("\n🎉 Usuário de teste criado! Agora você pode fazer login.")
        print("📱 Use no frontend:")
        print("   Email: teste@teste.com")
        print("   Senha: 123456")
    else:
        print("\n❌ Falha ao criar usuário de teste")
