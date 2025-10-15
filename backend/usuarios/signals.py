from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Entregador
from registro_entregadespesa.models import CategoriaDespesa

@receiver(post_save, sender=Entregador)
def criar_categorias_padrao(sender, instance, created, **kwargs):
    """
    Cria as 4 categorias padrão automaticamente quando um novo usuário é criado
    """
    if created:
        print(f"🆕 Novo usuário criado: {instance.nome}")
        
        # 4 categorias padrão
        categorias_padrao = [
            {
                'nome': 'Combustível',
                'descricao': 'Gastos com combustível (gasolina, etanol, diesel)'
            },
            {
                'nome': 'Manutenção',
                'descricao': 'Manutenção e reparos do veículo'
            },
            {
                'nome': 'Alimentação',
                'descricao': 'Refeições e lanches durante o trabalho'
            },
            {
                'nome': 'Outros',
                'descricao': 'Outras despesas não categorizadas'
            }
        ]
        
        # Criar as 4 categorias para o novo usuário
        for cat_data in categorias_padrao:
            CategoriaDespesa.objects.create(
                nome=cat_data['nome'],
                descricao=cat_data['descricao'],
                entregador=instance,
                ativa=True
            )
            print(f"   ✅ Categoria criada: {cat_data['nome']}")
        
        print(f"🎉 4 categorias padrão criadas para {instance.nome}")
