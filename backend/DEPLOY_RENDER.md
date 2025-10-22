# 🚀 Deploy no Render.com - Guia Completo

## 📋 Pré-requisitos
- [ ] Conta no GitHub
- [ ] Código commitado no GitHub
- [ ] Conta no Render.com

## 🔧 Passo a Passo

### 1. Preparar o Repositório
```bash
# No diretório backend/
git add .
git commit -m "Preparar para deploy no Render"
git push origin main
```

### 2. Criar Conta no Render.com
1. Acesse: https://render.com
2. Clique em "Get Started for Free"
3. Conecte com sua conta GitHub

### 3. Criar Web Service
1. No dashboard, clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `gestao-entregadores-backend`
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - **Start Command**: 
     ```bash
     gunicorn sistema.wsgi:application
     ```

### 4. Configurar Variáveis de Ambiente
No painel do Render, vá em "Environment" e adicione:

```env
DJANGO_SECRET_KEY=seu-secret-key-aqui
DEBUG=False
ALLOWED_HOSTS=gestao-entregadores-backend.onrender.com,localhost,127.0.0.1
STATIC_URL=/static/
STATIC_ROOT=/opt/render/project/src/staticfiles
MEDIA_URL=/media/
MEDIA_ROOT=/opt/render/project/src/media
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@gestaoentregadores.com
```

### 5. Criar Banco de Dados
1. No dashboard, clique em "New +"
2. Selecione "PostgreSQL"
3. Configure:
   - **Name**: `gestao-entregadores-db`
   - **Plan**: Free
   - **Database Name**: `gestao_entregadores`
   - **User**: `gestao_user`

### 6. Conectar Backend ao Banco
1. No seu Web Service, vá em "Environment"
2. Adicione a variável:
   ```env
   DATABASE_URL=postgresql://gestao_user:senha@host:porta/gestao_entregadores
   ```
   (O Render fornece essa URL automaticamente)

### 7. Executar Migrações
1. No painel do Web Service, vá em "Shell"
2. Execute:
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```

### 8. Criar Superusuário (Opcional)
```bash
python manage.py createsuperuser
```

## 🔗 URLs Finais
- **Backend**: `https://gestao-entregadores-backend.onrender.com`
- **Admin**: `https://gestao-entregadores-backend.onrender.com/admin/`
- **API**: `https://gestao-entregadores-backend.onrender.com/api/`

## 📱 Configurar Frontend
No seu app React Native, atualize a URL da API:
```javascript
// src/config/api.js
const API_BASE_URL = 'https://gestao-entregadores-backend.onrender.com';
```

## 🛠️ Comandos Úteis
```bash
# Ver logs
# No painel do Render > Web Service > Logs

# Executar comandos Django
# No painel do Render > Web Service > Shell
python manage.py shell
python manage.py dbshell
```

## ⚠️ Limitações do Plano Gratuito
- **Backend**: 750 horas/mês (suficiente para desenvolvimento)
- **Banco**: 1GB de armazenamento
- **Sleep**: Serviço "dorme" após 15min de inatividade

## 🔄 Deploy Automático
Após configurar, cada push para `main` fará deploy automático!

## 📞 Suporte
- Render Docs: https://render.com/docs
- Status: https://status.render.com
