#!/usr/bin/env python
"""
Script para criar despesas de exemplo com as 4 categorias fixas
"""

import os
import sys
import django
from datetime import date, timedelta
from decimal import Decimal

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

from django.contrib.auth import get_user_model
from registro_entregadespesa.models import CategoriaDespesa, Despesa

User = get_user_model()

def criar_despesas_exemplo_final():
    print("🚀 Criando despesas de exemplo com as 4 categorias fixas...")
    
    # Buscar o primeiro usuário ativo
    user = User.objects.filter(is_active=True).first()
    if not user:
        print("❌ Nenhum usuário encontrado")
        return False
    
    print(f"👤 Usuário: {user.nome}")
    
    # Limpar despesas antigas
    Despesa.objects.filter(entregador=user).delete()
    print("🧹 Despesas antigas removidas")
    
    # Buscar as 4 categorias fixas
    categorias = CategoriaDespesa.objects.filter(entregador=user, ativa=True)
    print(f"📊 Categorias disponíveis: {categorias.count()}")
    
    # Criar despesas de exemplo para cada categoria
    despesas_exemplo = [
        {
            'categoria_nome': 'Combustível',
            'descricao': 'Abastecimento de gasolina - Posto Shell',
            'valor': Decimal('85.50'),
            'dias_atras': 1
        },
        {
            'categoria_nome': 'Manutenção',
            'descricao': 'Troca de óleo e filtro do motor',
            'valor': Decimal('65.00'),
            'dias_atras': 3
        },
        {
            'categoria_nome': 'Alimentação',
            'descricao': 'Almoço no restaurante - Marmitex',
            'valor': Decimal('18.50'),
            'dias_atras': 2
        },
        {
            'categoria_nome': 'Outros',
            'descricao': 'Lavagem do veículo',
            'valor': Decimal('25.00'),
            'dias_atras': 4
        }
    ]
    
    despesas_criadas = 0
    
    for despesa_data in despesas_exemplo:
        try:
            # Buscar a categoria
            categoria = CategoriaDespesa.objects.get(
                nome=despesa_data['categoria_nome'],
                entregador=user
            )
            
            # Criar a despesa
            despesa = Despesa.objects.create(
                tipo_despesa='outros',  # Sempre usar 'outros' para categorias personalizadas
                categoria_personalizada=categoria,
                descricao=despesa_data['descricao'],
                valor=despesa_data['valor'],
                data=date.today() - timedelta(days=despesa_data['dias_atras']),
                entregador=user
            )
            
            despesas_criadas += 1
            print(f"✅ Despesa criada: {despesa.categoria_display} - R$ {despesa.valor} ({despesa.data})")
            
        except CategoriaDespesa.DoesNotExist:
            print(f"❌ Categoria não encontrada: {despesa_data['categoria_nome']}")
        except Exception as e:
            print(f"❌ Erro ao criar despesa {despesa_data['categoria_nome']}: {e}")
    
    # Verificar resultado
    total_despesas = Despesa.objects.filter(entregador=user).count()
    total_valor = sum(d.valor for d in Despesa.objects.filter(entregador=user))
    
    print(f"\n📊 Resumo:")
    print(f"   - Despesas criadas: {despesas_criadas}")
    print(f"   - Total de despesas: {total_despesas}")
    print(f"   - Valor total: R$ {total_valor:.2f}")
    
    print(f"\n📋 Despesas no sistema:")
    for despesa in Despesa.objects.filter(entregador=user):
        print(f"   - {despesa.categoria_display}: {despesa.descricao} - R$ {despesa.valor} ({despesa.data})")
    
    print(f"\n✅ Sistema simplificado pronto!")
    print(f"📱 Agora no app você terá:")
    print(f"   1. 4 categorias fixas para selecionar: Combustível, Manutenção, Alimentação, Outros")
    print(f"   2. 4 despesas de exemplo já cadastradas")
    print(f"   3. Sistema simples e estável, sem travamentos")
    
    return True

if __name__ == '__main__':
    try:
        criar_despesas_exemplo_final()
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
