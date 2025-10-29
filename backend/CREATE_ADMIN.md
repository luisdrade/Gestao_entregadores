# 👤 Criar Superusuário para Admin

## 🎯 **Opção 1: Via API (Recomendado)**

### **Criar Admin via API:**
```bash
curl -X POST https://entregasplus.onrender.com/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@admin.com",
    "password": "admin123",
    "nome": "Administrador"
  }'
```

### **Depois tornar Admin:**
1. **Acesse**: `https://entregasplus.onrender.com/admin/`
2. **Login**: `admin@admin.com` / `admin123`
3. **Vá para**: Users → Seu usuário
4. **Marque**: "Staff status" e "Superuser status"
5. **Salve**

## 🔧 **Opção 2: Via Shell (Pago)**

### **No Render Dashboard:**
1. **Web Service** → "Shell"
2. **Execute**:
   ```bash
   python manage.py createsuperuser
   ```
3. **Digite**: email, nome, senha

## 🎯 **Opção 3: Via Código (Automático)**

### **Criar comando Django:**
```python
# management/commands/create_admin.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    def handle(self, *args, **options):
        User = get_user_model()
        if not User.objects.filter(email='admin@admin.com').exists():
            User.objects.create_superuser(
                email='admin@admin.com',
                password='admin123',
                nome='Administrador'
            )
            self.stdout.write('Superusuário criado!')
        else:
            self.stdout.write('Superusuário já existe!')
```

## 🧪 **Testar Admin**

### **URLs para Testar:**
- **Admin**: `https://entregasplus.onrender.com/admin/`
- **API**: `https://entregasplus.onrender.com/api/`

### **Credenciais Sugeridas:**
- **Email**: `admin@admin.com`
- **Senha**: `admin123`

## 🎉 **Próximos Passos**

1. ✅ Backend funcionando
2. ✅ Admin acessível
3. 🔄 Criar superusuário
4. 🔄 Testar admin
5. 🔄 Configurar APK
6. 🔄 Deploy completo!





