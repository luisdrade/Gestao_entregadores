# 🔧 Configurar DATABASE_URL no Render - EntregasPlus

## ✅ Sua Internal Database URL do PostgreSQL

```
postgresql://user_entregas:C2OjukKx5anKGsMOICoYWxsrun3kDClQ@dpg-d3rsehk9c44c73avmah0-a/entregas_plus
```

## 📝 Passo a Passo

### 1️⃣ Acessar o Web Service no Render

1. Acesse: https://dashboard.render.com
2. Clique no seu **Web Service**: `entregas-plus-backend` ou similar

### 2️⃣ Adicionar Variável de Ambiente

1. No menu lateral, clique em **"Environment"**
2. Role até encontrar a variável `DATABASE_URL`
3. **Se já existir**:
   - Clique no lápis (✏️) para editar
   - Substitua o valor pela URL acima
   - Clique em **"Save Changes"**
4. **Se NÃO existir**:
   - Clique em **"Add Environment Variable"**
   - **Key**: `DATABASE_URL`
   - **Value**: Cole a URL acima
   - Clique em **"Add"**

### 3️⃣ Forçar Novo Deploy (IMPORTANTE!)

Após adicionar/atualizar a variável, o Render vai fazer deploy automaticamente:

1. Verifique no menu **"Logs"** se está fazendo build
2. Aguarde 5-10 minutos para o deploy terminar
3. Você verá: "Your service is live at..."

### 4️⃣ Executar Migrações do Banco

1. No painel do Web Service, clique em **"Shell"** (no menu lateral)
2. Aguarde o Shell abrir
3. Execute os comandos:

```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

4. Aguarde finalizar (vai criar as tabelas no banco)

### 5️⃣ (Opcional) Criar Usuário Admin

```bash
python manage.py createsuperuser
```
Siga as instruções para criar o primeiro usuário admin.

### 6️⃣ Testar o Endpoint

Após o deploy, teste se está funcionando (substitua pela URL do seu backend):

```bash
curl https://seu-backend.onrender.com/
```

Ou acesse no navegador (substitua pela URL do seu backend no Render):
- **Backend**: `https://seu-backend.onrender.com`
- **Admin**: `https://seu-backend.onrender.com/admin/`

### 7️⃣ Testar no App

Agora tente registrar um usuário pelo seu APK!

## ✅ Checklist

- [ ] DATABASE_URL configurada no Render
- [ ] Deploy executado com sucesso
- [ ] Migrações executadas no Shell
- [ ] Backend responde no navegador
- [ ] Teste de registro pelo APK

## 🚨 Problemas Comuns

### "could not connect to server"
- Verifique se a DATABASE_URL está correta
- Verifique se o banco está ativo (não dormindo)

### "relation does not exist"
- Execute `python manage.py migrate` no Shell

### Backend ainda com erros
- Verifique os Logs no Render
- Busque por palavras-chave como "error", "failed", "database"

## 📊 Verificar Logs

No Render Dashboard:
1. Web Service → **"Logs"**
2. Procure por erros de conexão com banco
3. A última linha deve mostrar "Starting gunicorn"

