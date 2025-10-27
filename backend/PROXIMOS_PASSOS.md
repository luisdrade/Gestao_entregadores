# ✅ Próximos Passos - EntregasPlus

## 🎯 Você JÁ TEM:
- ✅ Banco PostgreSQL criado no Render
- ✅ Código enviado para o GitHub
- ✅ Web Service criado no Render

## 📝 O QUE FAZER AGORA:

### 1️⃣ Configurar DATABASE_URL no Render

1. Acesse: **https://dashboard.render.com**
2. Clique no seu **Web Service** (backend)
3. No menu lateral, clique em **"Environment"**
4. Procure pela variável `DATABASE_URL`
5. **Se existir**: Clique no ícone de lápis (✏️) e edite
6. **Se NÃO existir**: Clique em **"Add Environment Variable"**
7. Cole este valor:

```
postgresql://user_entregas:C2OjukKx5anKGsMOICoYWxsrun3kDClQ@dpg-d3rsehk9c44c73avmah0-a/entregas_plus
```

8. Clique em **"Save Changes"**

### 2️⃣ Aguardar Deploy Automático

- O Render vai fazer deploy automaticamente
- Aguarde 5-10 minutos
- Verifique os **Logs** para acompanhar

### 3️⃣ Executar Migrações

1. No Dashboard do Web Service, clique em **"Shell"**
2. Execute:

```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

3. Aguarde finalizar

### 4️⃣ Testar no App!

Agora tente registrar um usuário pelo seu APK! 🎉

## 🔍 Como Saber se Funcionou?

- ✅ No Shell, as migrações rodam sem erros
- ✅ Os Logs mostram "Starting gunicorn"
- ✅ O app consegue registrar usuário

## ⚠️ Se Der Erro:

Verifique os **Logs** no Render para ver mensagens de erro relacionadas ao banco.

