from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Entregador

class EntregadorAdmin(UserAdmin):
    model = Entregador
    list_display = ['email', 'nome', 'cpf', 'telefone', 'email_validado', 'is_staff', 'is_superuser']
    list_filter = ['is_staff', 'is_superuser', 'email_validado']
    fieldsets = ((None, {'fields': ('email', 'password')}),
                ('Informações Pessoais', {'fields': ('nome', 'cpf', 'telefone', 'username', 'data_nascimento', 'endereco', 'cep', 'cidade', 'estado', 'foto')}),
                ('Validação', {'fields': ('email_validado',)}),
                ('Permissões', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
                )
    add_fieldsets = ((None, {
            'classes': ('wide',),
            'fields': ('email', 'nome', 'cpf', 'telefone', 'password1', 'password2', 'is_staff', 'is_superuser')}
        ),
    )
    search_fields = ('email', 'nome')
    ordering = ('email',)

admin.site.register(Entregador, EntregadorAdmin)
