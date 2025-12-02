from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Cria um superusuário admin automaticamente'

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Verificar se já existe
        if User.objects.filter(email='admin@gmail.com').exists():
            self.stdout.write(
                self.style.WARNING('Superusuário admin@gmail.com já existe!')
            )
            return
        
        # Criar superusuário
        try:
            User.objects.create_superuser(
                email='admin@gmail.com',
                password='admin',
                nome='Administrador'
            )
            self.stdout.write(
                self.style.SUCCESS('✅ Superusuário criado com sucesso!')
            )
            self.stdout.write('📧 Email: admin@gmail.com')
            self.stdout.write('🔑 Senha: admin')
            self.stdout.write('🌐 Admin: https://entregasplus.onrender.com/admin/')
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Erro ao criar superusuário: {e}')
            )


















