# 🔗 Conectando ao Projeto Existente no Railway

## Passo a Passo

### 1. Conectar ao projeto existente
```bash
railway link
```
- Selecione seu workspace
- Selecione o projeto que você quer usar

### 2. Verificar conexão
```bash
railway status
```

### 3. Ver serviços existentes
```bash
railway service
```

### 4. Ver variáveis de ambiente
```bash
railway variables
```

## Configurações necessárias

### Variáveis de ambiente que você precisa configurar:
```bash
# Django
railway variables set DJANGO_SECRET_KEY="sua-chave-secreta-aqui"
railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS="seu-app.railway.app"

# Database (se não tiver MySQL)
railway add mysql

# Static Files
railway variables set STATIC_URL="/static/"
railway variables set STATIC_ROOT="/app/staticfiles"

# Media Files
railway variables set MEDIA_URL="/media/"
railway variables set MEDIA_ROOT="/app/media"
```

## Deploy

### 1. Fazer deploy
```bash
railway up
```

### 2. Configurar banco de dados
```bash
# Executar migrações
railway run python manage.py migrate

# Criar superusuário
railway run python manage.py createsuperuser

# Coletar arquivos estáticos
railway run python manage.py collectstatic --noinput
```

### 3. Verificar deploy
```bash
railway open
```

## Troubleshooting

### Se der erro de banco:
```bash
# Verificar se MySQL está rodando
railway service

# Conectar ao banco
railway connect mysql
```

### Se der erro de variáveis:
```bash
# Ver todas as variáveis
railway variables

# Adicionar variável específica
railway variables set NOME_DA_VARIAVEL="valor"
```

