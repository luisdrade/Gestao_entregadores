# Deploy no Railway - Guia Passo a Passo

## 1. Preparação

### Instalar Railway CLI
```bash
npm install -g @railway/cli
```

### Login no Railway
```bash
railway login
```

## 2. Configurar o Projeto

### Inicializar projeto no Railway
```bash
cd backend
railway init
```

### Adicionar banco MySQL
```bash
railway add mysql
```

### Configurar variáveis de ambiente
```bash
# Django
railway variables set DJANGO_SECRET_KEY="sua-chave-secreta-aqui"
railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS="seu-app.railway.app"

# Database (será configurado automaticamente pelo Railway)
# DATABASE_URL será criado automaticamente

# Static Files
railway variables set STATIC_URL="/static/"
railway variables set STATIC_ROOT="/app/staticfiles"

# Media Files  
railway variables set MEDIA_URL="/media/"
railway variables set MEDIA_ROOT="/app/media"
```

## 3. Deploy

### Fazer deploy
```bash
railway up
```

### Verificar logs
```bash
railway logs
```

### Abrir aplicação
```bash
railway open
```

## 4. Configurar Banco de Dados

### Executar migrações
```bash
railway run python manage.py migrate
```

### Criar superusuário
```bash
railway run python manage.py createsuperuser
```

### Coletar arquivos estáticos
```bash
railway run python manage.py collectstatic --noinput
```

## 5. URLs Importantes

- **Aplicação**: `https://seu-app.railway.app`
- **Admin Django**: `https://seu-app.railway.app/admin/`
- **API**: `https://seu-app.railway.app/api/`

## 6. Monitoramento

### Ver status
```bash
railway status
```

### Ver logs em tempo real
```bash
railway logs --follow
```

## 7. Troubleshooting

### Problemas comuns:
1. **Erro de migração**: Execute `railway run python manage.py migrate`
2. **Erro de static files**: Execute `railway run python manage.py collectstatic --noinput`
3. **Erro de CORS**: Verifique as configurações de CORS_ALLOWED_ORIGINS
4. **Erro de banco**: Verifique se o PostgreSQL foi adicionado corretamente

### Comandos úteis:
```bash
# Ver variáveis de ambiente
railway variables

# Conectar ao banco
railway connect mysql

# Executar comando Django
railway run python manage.py shell
```
