from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from datetime import date, timedelta
from decimal import Decimal
from registro_entregadespesa.models import Despesa, CategoriaDespesa

User = get_user_model()

class Command(BaseCommand):
    help = 'Popula o banco de dados com despesas iniciais para todos os entregadores'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Limpa todas as despesas existentes antes de popular',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Limpando despesas existentes...')
            Despesa.objects.all().delete()
            CategoriaDespesa.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Despesas limpas com sucesso!'))

        # Buscar todos os entregadores
        entregadores = User.objects.filter(is_active=True)
        
        if not entregadores.exists():
            self.stdout.write(
                self.style.WARNING('Nenhum entregador encontrado. Crie usuários primeiro.')
            )
            return

        self.stdout.write(f'Populando despesas para {entregadores.count()} entregadores...')

        # Dados de despesas iniciais
        despesas_iniciais = [
            # Combustível
            {
                'tipo_despesa': 'combustivel',
                'descricao': 'Abastecimento de gasolina - Posto Shell',
                'valor': Decimal('85.50'),
                'dias_atras': 2
            },
            {
                'tipo_despesa': 'combustivel', 
                'descricao': 'Abastecimento de etanol - Posto Ipiranga',
                'valor': Decimal('72.30'),
                'dias_atras': 5
            },
            {
                'tipo_despesa': 'combustivel',
                'descricao': 'Abastecimento de gasolina - Posto BR',
                'valor': Decimal('95.80'),
                'dias_atras': 8
            },
            
            # Alimentação
            {
                'tipo_despesa': 'alimentacao',
                'descricao': 'Almoço no restaurante - Marmitex',
                'valor': Decimal('18.50'),
                'dias_atras': 1
            },
            {
                'tipo_despesa': 'alimentacao',
                'descricao': 'Lanche da tarde - Padaria',
                'valor': Decimal('12.00'),
                'dias_atras': 3
            },
            {
                'tipo_despesa': 'alimentacao',
                'descricao': 'Café da manhã - Lanchonete',
                'valor': Decimal('8.50'),
                'dias_atras': 6
            },
            
            # Manutenção
            {
                'tipo_despesa': 'manutencao',
                'descricao': 'Troca de óleo do motor',
                'valor': Decimal('45.00'),
                'dias_atras': 10
            },
            {
                'tipo_despesa': 'manutencao',
                'descricao': 'Revisão geral do veículo',
                'valor': Decimal('120.00'),
                'dias_atras': 15
            },
            
            # Pedágio
            {
                'tipo_despesa': 'pedagio',
                'descricao': 'Pedágio - Rodovia SP-348',
                'valor': Decimal('15.80'),
                'dias_atras': 4
            },
            {
                'tipo_despesa': 'pedagio',
                'descricao': 'Pedágio - Rodovia SP-330',
                'valor': Decimal('12.50'),
                'dias_atras': 7
            },
            
            # Estacionamento
            {
                'tipo_despesa': 'estacionamento',
                'descricao': 'Estacionamento - Shopping Center',
                'valor': Decimal('8.00'),
                'dias_atras': 2
            },
            {
                'tipo_despesa': 'estacionamento',
                'descricao': 'Estacionamento - Centro da cidade',
                'valor': Decimal('5.00'),
                'dias_atras': 5
            },
            
            # Ferramentas e Equipamentos
            {
                'tipo_despesa': 'ferramentas',
                'descricao': 'Compra de caixa térmica para entregas',
                'valor': Decimal('45.00'),
                'dias_atras': 7
            },
            {
                'tipo_despesa': 'ferramentas',
                'descricao': 'Compra de cordas e elásticos',
                'valor': Decimal('25.00'),
                'dias_atras': 10
            },
            
            # Comunicação
            {
                'tipo_despesa': 'comunicacao',
                'descricao': 'Recarga de celular para trabalho',
                'valor': Decimal('30.00'),
                'dias_atras': 5
            },
            {
                'tipo_despesa': 'comunicacao',
                'descricao': 'Pacote de dados móveis',
                'valor': Decimal('50.00'),
                'dias_atras': 12
            },
            
            # Uniforme e EPIs
            {
                'tipo_despesa': 'uniforme',
                'descricao': 'Compra de uniforme da empresa',
                'valor': Decimal('80.00'),
                'dias_atras': 15
            },
            {
                'tipo_despesa': 'uniforme',
                'descricao': 'Compra de luvas de proteção',
                'valor': Decimal('15.00'),
                'dias_atras': 8
            },
            
            # Documentação
            {
                'tipo_despesa': 'documentacao',
                'descricao': 'Renovação da CNH',
                'valor': Decimal('120.00'),
                'dias_atras': 20
            },
            {
                'tipo_despesa': 'documentacao',
                'descricao': 'Taxa de licenciamento do veículo',
                'valor': Decimal('85.00'),
                'dias_atras': 25
            },
            
            # Outros
            {
                'tipo_despesa': 'outros',
                'descricao': 'Lavagem do veículo',
                'valor': Decimal('25.00'),
                'dias_atras': 3
            },
            {
                'tipo_despesa': 'outros',
                'descricao': 'Compra de água para entrega',
                'valor': Decimal('15.00'),
                'dias_atras': 1
            }
        ]

        # Categorias personalizadas comuns
        categorias_personalizadas = [
            {
                'nome': 'Gasolina',
                'descricao': 'Gastos específicos com gasolina'
            },
            {
                'nome': 'Óleo do Motor',
                'descricao': 'Troca de óleo e filtros'
            },
            {
                'nome': 'Pneus',
                'descricao': 'Compra e manutenção de pneus'
            },
            {
                'nome': 'Lavagem',
                'descricao': 'Lavagem e limpeza do veículo'
            },
            {
                'nome': 'Ferramentas',
                'descricao': 'Ferramentas e equipamentos de trabalho'
            }
        ]

        despesas_criadas = 0
        categorias_criadas = 0

        for entregador in entregadores:
            self.stdout.write(f'Processando entregador: {entregador.nome}')
            
            # Criar categorias personalizadas para o entregador
            for cat_data in categorias_personalizadas:
                categoria, created = CategoriaDespesa.objects.get_or_create(
                    nome=cat_data['nome'],
                    entregador=entregador,
                    defaults={
                        'descricao': cat_data['descricao'],
                        'ativa': True
                    }
                )
                if created:
                    categorias_criadas += 1

            # Criar despesas iniciais
            for despesa_data in despesas_iniciais:
                data_despesa = date.today() - timedelta(days=despesa_data['dias_atras'])
                
                despesa = Despesa.objects.create(
                    tipo_despesa=despesa_data['tipo_despesa'],
                    descricao=despesa_data['descricao'],
                    valor=despesa_data['valor'],
                    data=data_despesa,
                    entregador=entregador
                )
                despesas_criadas += 1

            # Adicionar algumas despesas com categorias personalizadas
            despesas_categorias_personalizadas = [
                {
                    'categoria_nome': 'Gasolina',
                    'descricao': 'Abastecimento extra de gasolina',
                    'valor': Decimal('65.00'),
                    'dias_atras': 4
                },
                {
                    'categoria_nome': 'Óleo do Motor',
                    'descricao': 'Troca de óleo e filtro de ar',
                    'valor': Decimal('55.00'),
                    'dias_atras': 12
                },
                {
                    'categoria_nome': 'Lavagem',
                    'descricao': 'Lavagem completa do veículo',
                    'valor': Decimal('30.00'),
                    'dias_atras': 6
                }
            ]

            for despesa_data in despesas_categorias_personalizadas:
                try:
                    categoria = CategoriaDespesa.objects.get(
                        nome=despesa_data['categoria_nome'],
                        entregador=entregador
                    )
                    data_despesa = date.today() - timedelta(days=despesa_data['dias_atras'])
                    
                    despesa = Despesa.objects.create(
                        tipo_despesa='outros',
                        categoria_personalizada=categoria,
                        descricao=despesa_data['descricao'],
                        valor=despesa_data['valor'],
                        data=data_despesa,
                        entregador=entregador
                    )
                    despesas_criadas += 1
                except CategoriaDespesa.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(f'Categoria {despesa_data["categoria_nome"]} não encontrada para {entregador.nome}')
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f'✅ Dados populados com sucesso!\n'
                f'   - {despesas_criadas} despesas criadas\n'
                f'   - {categorias_criadas} categorias personalizadas criadas\n'
                f'   - {entregadores.count()} entregadores processados'
            )
        )
