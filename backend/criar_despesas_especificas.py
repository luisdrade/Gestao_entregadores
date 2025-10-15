#!/usr/bin/env python
"""
Script para criar 3 despesas específicas: Combustível, Manutenção e Alimentação
Execute: python criar_despesas_especificas.py
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
from registro_entregadespesa.models import Despesa

User = get_user_model()

def criar_despesas_especificas():
    print("🚀 Criando 3 despesas específicas...")
    
    # Buscar o primeiro entregador ativo
    entregador = User.objects.filter(is_active=True).first()
    
    if not entregador:
        print("❌ Nenhum entregador encontrado. Crie usuários primeiro.")
        return False
    
    print(f"👤 Criando despesas para: {entregador.nome}")
    
    # Despesas específicas solicitadas
    despesas_para_criar = [
        {
            'tipo_despesa': 'combustivel',
            'descricao': 'Abastecimento de gasolina - Posto Shell',
            'valor': Decimal('85.50'),
            'data': date.today() - timedelta(days=1)
        },
        {
            'tipo_despesa': 'manutencao',
            'descricao': 'Troca de óleo e filtro do motor',
            'valor': Decimal('65.00'),
            'data': date.today() - timedelta(days=3)
        },
        {
            'tipo_despesa': 'alimentacao',
            'descricao': 'Almoço no restaurante - Marmitex',
            'valor': Decimal('18.50'),
            'data': date.today() - timedelta(days=2)
        }
    ]
    
    despesas_criadas = 0
    
    for despesa_data in despesas_para_criar:
        # Verificar se já existe uma despesa similar
        despesa_existente = Despesa.objects.filter(
            tipo_despesa=despesa_data['tipo_despesa'],
            entregador=entregador,
            descricao__icontains=despesa_data['descricao'].split(' - ')[0]  # Parte antes do hífen
        ).exists()
        
        if not despesa_existente:
            despesa = Despesa.objects.create(
                tipo_despesa=despesa_data['tipo_despesa'],
                descricao=despesa_data['descricao'],
                valor=despesa_data['valor'],
                data=despesa_data['data'],
                entregador=entregador
            )
            despesas_criadas += 1
            print(f"✅ Criada: {despesa.get_tipo_despesa_display()} - {despesa.descricao} - R$ {despesa.valor}")
        else:
            print(f"⚠️  Já existe: {despesa_data['tipo_despesa']} - {despesa_data['descricao']}")
    
    print(f"\n🎉 Processo concluído!")
    print(f"📊 Despesas criadas: {despesas_criadas}")
    
    # Mostrar total de despesas
    total_despesas = Despesa.objects.filter(entregador=entregador).count()
    print(f"💰 Total de despesas do entregador: {total_despesas}")
    
    return True

if __name__ == '__main__':
    try:
        criar_despesas_especificas()
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
