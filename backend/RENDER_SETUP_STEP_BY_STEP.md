# 🚀 Configuração Render.com - Passo a Passo

## 📋 **Pré-requisitos**
- [x] Conta no GitHub
- [x] Código commitado no GitHub
- [ ] Conta no Render.com

## 🔧 **Passo 1: Criar Conta no Render**

1. **Acesse**: https://render.com
2. **Clique**: "Get Started for Free"
3. **Conecte**: Com sua conta GitHub
4. **Autorize**: O acesso ao seu repositório

## 🗄️ **Passo 2: Criar Banco PostgreSQL**

1. **No Dashboard**: Clique em "New +"
2. **Selecione**: "PostgreSQL"
3. **Configure**:
   - **Name**: `gestao-entregadores-db`
   - **Plan**: Free
   - **Database**: `gestao_entregadores`
   - **User**: `gestao_user`
   - **Region**: `Oregon (US West)` (mais próximo do Brasil)

4. **Clique**: "Create Database"
5. **Aguarde**: Criação (2-3 minutos)

## 📝 **Passo 3: Anotar Credenciais**

Após criar o banco, anote:
- **Internal Database URL**: `postgresql://gestao_user:senha@host:porta/gestao_entregadores`
- **External Database URL**: (para conectar externamente)

## 🌐 **Passo 4: Criar Web Service**

1. **No Dashboard**: Clique em "New +"
2. **Selecione**: "Web Service"
3. **Conecte**: Seu repositório GitHub
4. **Selecione**: Repositório `Gestao_entregadores`

## ⚙️ **Passo 5: Configurar Web Service**

### **Configurações Básicas**:
- **Name**: `gestao-entregadores-backend`
- **Environment**: `Python 3`
- **Region**: `Oregon (US West)`
- **Branch**: `main`

### **Configurações Avançadas**:
- **Root Directory**: `backend`
- **Build Command**: 
  ```bash
  pip install -r requirements.txt && python manage.py collectstatic --noinput
  ```
- **Start Command**: 
  ```bash
  gunicorn sistema.wsgi:application
  ```

## 🔐 **Passo 6: Configurar Variáveis de Ambiente**

No painel do Web Service → "Environment" → "Add Environment Variable":

### **Variáveis Obrigatórias**:
```env
DJANGO_SECRET_KEY=seu-secret-key-aqui-32-caracteres-minimos
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

### **Como Obter DJANGO_SECRET_KEY**:
```bash
# No seu terminal local
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## 🚀 **Passo 7: Deploy**

1. **Clique**: "Create Web Service"
2. **Aguarde**: Build (5-10 minutos)
3. **Verifique**: Logs para erros

## 🔄 **Passo 8: Executar Migrações**

1. **No painel**: Web Service → "Shell"
2. **Execute**:
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```

## 👤 **Passo 9: Criar Superusuário (Opcional)**

```bash
python manage.py createsuperuser
```

## 🧪 **Passo 10: Testar**

### **URLs para Testar**:
- **Backend**: `https://gestao-entregadores-backend.onrender.com`
- **Admin**: `https://gestao-entregadores-backend.onrender.com/admin/`
- **API**: `https://gestao-entregadores-backend.onrender.com/api/`

### **Teste Básico**:
```bash
curl https://gestao-entregadores-backend.onrender.com/api/
```

## 🔧 **Troubleshooting**

### **Erro de Build**:
- Verifique se `requirements.txt` está correto
- Verifique se `Root Directory` está como `backend`

### **Erro de Migração**:
```bash
python manage.py migrate --run-syncdb
```

### **Erro de Static Files**:
```bash
python manage.py collectstatic --noinput --clear
```

### **Verificar Logs**:
- Web Service → "Logs"

## 🎉 **Próximos Passos**

1. ✅ Backend na nuvem
2. ✅ Banco PostgreSQL
3. ✅ SSL automático
4. 🔄 Atualizar frontend para nova URL
5. 🔄 Testar todas as funcionalidades

## 📱 **Configurar Frontend**

No seu app React Native:
```javascript
// src/config/api.js
const API_BASE_URL = 'https://gestao-entregadores-backend.onrender.com';
```

## 🆘 **Suporte**

- **Render Docs**: https://render.com/docs
- **Status**: https://status.render.com
- **Django Docs**: https://docs.djangoproject.com
