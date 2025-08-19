#!/usr/bin/env python
"""
Script para testar o banco de dados e criar um entregador de teste
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

def test_banco():
    """Testa o banco de dados e cria um entregador se necessário"""
    try:
        from usuarios.models import Entregador
        from registro_entregadespesa.models import RegistroTrabalho, Despesa
        
        print("=== Teste do Banco de Dados ===\n")
        
        # Verificar entregadores
        entregadores = Entregador.objects.all()
        print(f"✓ Entregadores encontrados: {entregadores.count()}")
        
        if entregadores.count() == 0:
            print("⚠️  Nenhum entregador encontrado! Criando um de teste...")
            
            # Criar entregador de teste
            entregador_teste = Entregador.objects.create(
                nome="Entregador Teste",
                email="teste@entregador.com",
                telefone="11999999999",
                username="teste_entregador",
                cpf="123.456.789-00"
            )
            print(f"✓ Entregador criado: {entregador_teste.nome} (ID: {entregador_teste.id})")
        else:
            for entregador in entregadores:
                print(f"  - {entregador.nome} ({entregador.email}) - ID: {entregador.id}")
        
        # Verificar tabelas
        print(f"\n✓ Tabela RegistroTrabalho: {RegistroTrabalho.objects.count()} registros")
        print(f"✓ Tabela Despesa: {Despesa.objects.count()} registros")
        
        # Testar conexão
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        print(f"✓ Conexão com banco OK: {result[0]}")
        
        print("\n=== Banco de dados funcionando! ===")
        
    except Exception as e:
        print(f"✗ Erro: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_banco()
