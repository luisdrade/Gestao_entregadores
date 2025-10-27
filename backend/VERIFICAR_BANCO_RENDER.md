# 🗄️ Verificar Conexão com Banco PostgreSQL no Render

## 📋 Checklist

### 1️⃣ Verificar se o Banco PostgreSQL Existe no Render

1. Acesse: https://dashboard.render.com
2. Procure por um banco chamado `entregas-plus-db` ou similar (seu banco já existe e se chama `entregas_plus`)
3. **Anote**: Sua Internal Database URL já foi fornecida

### 2️⃣ Banco PostgreSQL Já Existe ✅

Seu banco PostgreSQL já está criado:
- **Database**: `entregas_plus`
- **User**: `user_entregas`
- **Internal Database URL**: Já fornecida

### 3️⃣ Verificar Variável de Ambiente DATABASE_URL

1. No Dashboard do Render, vá para seu **Web Service** (`entregas-plus-backend` ou similar)
2. Vá em **"Environment"** (no menu lateral)
3. Procure pela variável `DATABASE_URL`
4. **Se NÃO existir**:
   - Clique em **"Add Environment Variable"**
   - **Key**: `DATABASE_URL`
   - **Value**: Cole a Internal Database URL do banco criado
5. **Se existir**: Verifique se está correta (deve começar com `postgresql://`)

### 4️⃣ Executar Migrações do Banco

1. No Dashboard do Web Service, vá em **"Shell"**
2. Execute os comandos:
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```
3. **Aguarde** o término das migrações

### 5️⃣ Verificar se Funcionou

No Shell do Render, execute:
```bash
python manage.py dbshell
```

Se abrir o psql, está funcionando! Digite `\q` para sair.

## 🔧 Comandos Úteis no Shell

### Verificar Conexão com o Banco
```bash
python manage.py check --database default
```

### Ver Logs do Render
```bash
# No Dashboard do Web Service > "Logs"
# Procure por erros de conexão com banco
```

### Recriar Banco (SE TUDO MAIS FALHAR)
⚠️ **ATENÇÃO**: Isso apaga todos os dados!
```bash
# 1. No Shell do Web Service
python manage.py flush --noinput

# 2. Executar migrações novamente
python manage.py migrate

# 3. Criar superusuário
python manage.py createsuperuser
```

## 🚨 Erros Comuns

### "django.db.utils.OperationalError: could not connect to server"
- **Causa**: DATABASE_URL incorreta ou banco não existe
- **Solução**: Verifique se criou o banco no Dashboard

### "relation does not exist"
- **Causa**: Migrações não foram executadas
- **Solução**: Execute `python manage.py migrate`

### "database is locked"
- **Causa**: Banco está ocupado (normal após criar)
- **Solução**: Aguarde 1-2 minutos e tente novamente

## 📞 URLs para Testar Depois

Após configurar tudo:
- **Backend**: `https://gestao-entregadores-backend.onrender.com`
- **Admin**: `https://gestao-entregadores-backend.onrender.com/admin/`
- **API**: `https://gestao-entregadores-backend.onrender.com/api/`

## ✅ Próximos Passos

1. ✅ Verificar se banco existe no Render
2. ✅ Criar banco se necessário
3. ✅ Configurar DATABASE_URL
4. ✅ Executar migrações
5. ✅ Testar o registro pelo APK

