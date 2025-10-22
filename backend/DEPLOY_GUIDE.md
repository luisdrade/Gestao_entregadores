# 🚀 Guia Completo de Deploy - Backend + Banco

## 🎯 **Recomendação: Render.com (Mais Simples)**

### ✅ **Por que Render.com?**
- **100% Gratuito** para desenvolvimento
- **Backend + Banco** incluídos
- **Deploy automático** via GitHub
- **SSL automático**
- **Interface simples**

---

## 📋 **Passo a Passo - Render.com**

### 1️⃣ **Preparar o Código**
```bash
# No diretório backend/
git add .
git commit -m "Preparar para deploy no Render"
git push origin main
```

### 2️⃣ **Criar Conta no Render**
1. Acesse: https://render.com
2. "Get Started for Free"
3. Conecte com GitHub

### 3️⃣ **Criar Banco PostgreSQL**
1. Dashboard → "New +" → "PostgreSQL"
2. **Name**: `gestao-entregadores-db`
3. **Plan**: Free
4. **Database**: `gestao_entregadores`
5. **User**: `gestao_user`
6. **Anote a DATABASE_URL** (será usada depois)

### 4️⃣ **Criar Web Service**
1. Dashboard → "New +" → "Web Service"
2. Conecte seu repositório GitHub
3. Configure:
   - **Name**: `gestao-entregadores-backend`
   - **Environment**: `Python 3`
   - **Root Directory**: `backend`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - **Start Command**: 
     ```bash
     gunicorn sistema.wsgi:application
     ```

### 5️⃣ **Configurar Variáveis de Ambiente**
No painel do Web Service → "Environment":

```env
DJANGO_SECRET_KEY=seu-secret-key-aqui-32-caracteres
DEBUG=False
ALLOWED_HOSTS=gestao-entregadores-backend.onrender.com,localhost,127.0.0.1
DATABASE_URL=postgresql://gestao_user:senha@host:porta/gestao_entregadores
STATIC_URL=/static/
STATIC_ROOT=/opt/render/project/src/staticfiles
MEDIA_URL=/media/
MEDIA_ROOT=/opt/render/project/src/media
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@gestaoentregadores.com
```

### 6️⃣ **Executar Migrações**
1. No painel → "Shell"
2. Execute:
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```

### 7️⃣ **Migrar Dados (Opcional)**
Se você tem dados no banco local:

```bash
# 1. Exportar dados do banco local
python migrate_data.py export

# 2. Configurar variáveis para banco local temporariamente
# 3. Importar dados
python migrate_data.py import

# 4. Criar superusuário
python migrate_data.py superuser
```

---

## 🔗 **URLs Finais**
- **Backend**: `https://gestao-entregadores-backend.onrender.com`
- **Admin**: `https://gestao-entregadores-backend.onrender.com/admin/`
- **API**: `https://gestao-entregadores-backend.onrender.com/api/`

---

## 📱 **Configurar Frontend**
No seu app React Native, atualize:

```javascript
// src/config/api.js
const API_BASE_URL = 'https://gestao-entregadores-backend.onrender.com';
```

---

## ⚠️ **Limitações do Plano Gratuito**
- **Backend**: 750 horas/mês (suficiente para desenvolvimento)
- **Banco**: 1GB de armazenamento
- **Sleep**: Serviço "dorme" após 15min de inatividade
- **Wake-up**: Primeira requisição pode demorar 30s

---

## 🔄 **Deploy Automático**
Após configurar, cada push para `main` fará deploy automático!

---

## 🆘 **Troubleshooting**

### Erro de Migração
```bash
# No Shell do Render
python manage.py migrate --run-syncdb
```

### Erro de Static Files
```bash
# No Shell do Render
python manage.py collectstatic --noinput --clear
```

### Verificar Logs
- Render Dashboard → Web Service → Logs

---

## 🎉 **Próximos Passos**
1. ✅ Backend na nuvem
2. ✅ Banco na nuvem  
3. ✅ SSL automático
4. ✅ Deploy automático
5. 🔄 Configurar frontend para usar nova URL
6. 🔄 Testar todas as funcionalidades

---

## 📞 **Suporte**
- Render Docs: https://render.com/docs
- Status: https://status.render.com
- Django Docs: https://docs.djangoproject.com
