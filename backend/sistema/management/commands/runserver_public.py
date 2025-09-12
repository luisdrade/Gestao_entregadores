    from django.core.management.commands.runserver import Command as RunserverCommand


class Command(RunserverCommand):
    """
    Comando personalizado para rodar o servidor Django em 0.0.0.0:8000
    Use: python manage.py runserver_public
    """
    
    def add_arguments(self, parser):
        super().add_arguments(parser)
        # Define o IP padrão como 0.0.0.0:8000
        parser.set_defaults(addrport='0.0.0.0:8000')
    
    def handle(self, *args, **options):
        # Força o uso do IP 0.0.0.0:8000 se não especificado
        if not options.get('addrport'):
            options['addrport'] = '0.0.0.0:8000'
        
        self.stdout.write(
            self.style.SUCCESS('Iniciando servidor Django em 0.0.0.0:8000...')
        )
        super().handle(*args, **options)
