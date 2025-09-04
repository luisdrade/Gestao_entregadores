#!/usr/bin/env python
"""
Script de teste para o sistema de autenticação
Execute este script para testar se o sistema está funcionando
"""

import os
import sys
import django

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

from django.contrib.auth import get_user_model
from usuarios.models import Entregador

def test_system():
    """Testa se o sistema está funcionando"""
    print("🔍 Testando sistema de autenticação...")
    
    try:
        # Verificar se o modelo está funcionando
        User = get_user_model()
        print("✅ Modelo de usuário carregado com sucesso")
        
        # Verificar se há usuários no sistema
        total_users = User.objects.count()
        print(f"✅ Total de usuários no sistema: {total_users}")
        
        # Verificar se há administradores
        admin_users = User.objects.filter(is_staff=True).count()
        print(f"✅ Total de administradores: {admin_users}")
        
        # Verificar se há entregadores
        entregadores = User.objects.filter(is_staff=False).count()
        print(f"✅ Total de entregadores: {entregadores}")
        
        # Listar usuários existentes
        if total_users > 0:
            print("\n📋 Usuários existentes:")
            for user in User.objects.all():
                user_type = "Admin" if user.is_staff else "Entregador"
                print(f"  - {user.nome} ({user.email}) - {user_type}")
        
        print("\n🎉 Sistema funcionando perfeitamente!")
        return True
        
    except Exception as e:
        print(f"❌ Erro no sistema: {str(e)}")
        return False

def create_superuser():
    """Cria um superusuário para teste"""
    print("\n🔧 Criando superusuário para teste...")
    
    try:
        # Verificar se já existe um superusuário
        if Entregador.objects.filter(is_superuser=True).exists():
            print("✅ Superusuário já existe")
            return True
        
        # Criar superusuário
        superuser = Entregador.objects.create_superuser(
            email='admin@entregasplus.com',
            password='admin123',
            nome='Administrador Sistema',
            cpf='000.000.000-00',
            telefone='(11) 00000-0000',
            username='admin_sistema'
        )
        
        print(f"✅ Superusuário criado com sucesso:")
        print(f"  - Email: {superuser.email}")
        print(f"  - Senha: admin123")
        print(f"  - Nome: {superuser.nome}")
        print(f"  - Tipo: {'Super Admin' if superuser.is_superuser else 'Admin'}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar superusuário: {str(e)}")
        return False

def create_test_entregador():
    """Cria um entregador de teste"""
    print("\n🔧 Criando entregador de teste...")
    
    try:
        # Verificar se já existe o entregador de teste
        if Entregador.objects.filter(email='entregador@teste.com').exists():
            print("✅ Entregador de teste já existe")
            return True
        
        # Criar entregador de teste
        entregador = Entregador.objects.create_user(
            email='entregador@teste.com',
            password='entregador123',
            nome='João Entregador Teste',
            cpf='111.111.111-11',
            telefone='(11) 11111-1111',
            username='joao_entregador'
        )
        
        print(f"✅ Entregador de teste criado com sucesso:")
        print(f"  - Email: {entregador.email}")
        print(f"  - Senha: entregador123")
        print(f"  - Nome: {entregador.nome}")
        print(f"  - Tipo: {'Admin' if entregador.is_staff else 'Entregador'}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar entregador de teste: {str(e)}")
        return False

def main():
    """Função principal"""
    print("🚀 Sistema de Gestão de Entregadores - Teste de Autenticação")
    print("=" * 60)
    
    # Testar sistema
    if not test_system():
        print("❌ Falha no teste do sistema")
        return
    
    # Criar superusuário
    if not create_superuser():
        print("❌ Falha ao criar superusuário")
        return
    
    # Criar entregador de teste
    if not create_test_entregador():
        print("❌ Falha ao criar entregador de teste")
        return
    
    print("\n" + "=" * 60)
    print("🎯 CREDENCIAIS DE TESTE:")
    print("=" * 60)
    print("👑 SUPER ADMIN:")
    print("  - Email: admin@entregasplus.com")
    print("  - Senha: admin123")
    print("  - Tipo: Super Administrador")
    print()
    print("🚚 ENTREGADOR:")
    print("  - Email: entregador@teste.com")
    print("  - Senha: entregador123")
    print("  - Tipo: Entregador Normal")
    print()
    print("🔗 ENDPOINTS DISPONÍVEIS:")
    print("  - Login: POST /api/auth/login/")
    print("  - Registro: POST /api/auth/register/")
    print("  - Perfil: GET /api/auth/profile/")
    print("  - Logout: POST /api/auth/logout/")
    print("  - Admin Users: GET /api/admin/users/")
    print()
    print("📚 Consulte o arquivo API_AUTH_DOCUMENTATION.md para mais detalhes")
    print("=" * 60)

if __name__ == '__main__':
    main()
