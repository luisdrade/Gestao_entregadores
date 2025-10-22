# 🔧 Corrigir Start Command no Render

## 🚨 **Problema Identificado**
```
ModuleNotFoundError: No module named 'your_application'
```

## ✅ **Solução**

### **1. Acessar Configurações**
1. **Render Dashboard** → Seu Web Service
2. **Clique em**: "Settings"
3. **Encontre**: "Start Command"

### **2. Corrigir Start Command**
**Alterar de:**
```bash
gunicorn your_application.wsgi
```

**Para:**
```bash
gunicorn sistema.wsgi
```

### **3. Verificar Outras Configurações**

#### **Build Command:**
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput
```

#### **Root Directory:**
```
backend
```

#### **Environment:**
```
Python 3
```

## 🔄 **Após Corrigir**

### **1. Salvar Configurações**
- **Clique**: "Save Changes"
- **Aguarde**: Redeploy automático

### **2. Verificar Logs**
- **Web Service** → "Logs"
- **Deve aparecer**: "Build successful 🎉"

### **3. Executar Migrações**
- **Web Service** → "Shell"
- **Execute**:
  ```bash
  python manage.py migrate
  python manage.py collectstatic --noinput
  ```

## 🧪 **Testar API**

### **URLs para Testar:**
- **Backend**: `https://gestao-entregadores-backend.onrender.com`
- **Admin**: `https://gestao-entregadores-backend.onrender.com/admin/`
- **API**: `https://gestao-entregadores-backend.onrender.com/api/`

### **Teste Básico:**
```bash
curl https://gestao-entregadores-backend.onrender.com/api/
```

## ⚠️ **Se Ainda Der Erro**

### **Verificar Variáveis de Ambiente:**
- **DJANGO_SECRET_KEY**: Configurado
- **DATABASE_URL**: Configurado
- **ALLOWED_HOSTS**: Configurado

### **Verificar Logs:**
- **Web Service** → "Logs"
- **Procurar por**: Erros específicos

## 🎯 **Configurações Finais Corretas**

### **Web Service Settings:**
- **Name**: `gestao-entregadores-backend`
- **Environment**: `Python 3`
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- **Start Command**: `gunicorn sistema.wsgi`

### **Environment Variables:**
```env
DJANGO_SECRET_KEY=$(ws_4z&b%ip3&6r_ghx_za=eobfbaotro+e)aj1_+b5=_205m
DEBUG=False
ALLOWED_HOSTS=gestao-entregadores-backend.onrender.com,localhost,127.0.0.1
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
STATIC_URL=/static/
STATIC_ROOT=/opt/render/project/src/staticfiles
MEDIA_URL=/media/
MEDIA_ROOT=/opt/render/project/src/media
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@gestaoentregadores.com
```

## 🎉 **Próximos Passos**
1. ✅ Corrigir Start Command
2. ✅ Aguardar redeploy
3. ✅ Executar migrações
4. ✅ Testar API
5. ✅ Configurar frontend
