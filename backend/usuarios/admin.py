from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Entregador

class EntregadorAdmin(UserAdmin):
    model = Entregador
    list_display = ['email', 'nome', 'cpf', 'telefone', 'is_staff', 'is_superuser']
    list_filter = ['is_staff', 'is_superuser']
    fieldsets = ((None, {'fields': ('email', 'password')}),
                ('Informações Pessoais', {'fields': ('nome', 'cpf', 'telefone')}),
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
