# 🗄️ Verificar Conexão com Banco PostgreSQL no Render

## 📋 Checklist

### 1️⃣ Verificar se o Banco PostgreSQL Existe no Render

1. Acesse: https://dashboard.render.com
2. Procure por um banco chamado `gestao-entregadores-db`
3. **Se NÃO existir** → Siga o Passo 2 abaixo
4. **Se existir** → Anote a Internal Database URL

### 2️⃣ Criar Banco PostgreSQL (se necessário)

1. No Dashboard do Render, clique em **"New +"**
2. Selecione **"PostgreSQL"**
3. Configure:
   - **Name**: `gestao-entregadores-db`
   - **Database**: `gestao_entregadores`
   - **User**: `gestao_user`
   - **Plan**: Free
   - **Region**: Oregon (US West)
4. Clique em **"Create Database"**
5. **IMPORTANTE**: Aguarde 2-3 minutos para o banco ficar pronto
6. Anote a **Internal Database URL** (algo como: `postgresql://gestao_user:senha@host:porta/gestao_entregadores`)

### 3️⃣ Verificar Variável de Ambiente DATABASE_URL

1. No Dashboard do Render, vá para seu **Web Service** (`gestao-entregadores-backend`)
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

