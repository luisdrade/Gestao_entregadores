# 🔧 Solucionar Migrações no Render

## O Problema:
As migrações NÃO estão rodando, então as tabelas NÃO existem no banco PostgreSQL.

## ✅ Solução - 3 Passos:

### 1️⃣ Verificar/Configurar DATABASE_URL no Render

1. Acesse: https://dashboard.render.com
2. Vá no seu **Web Service**
3. No menu lateral, clique em **"Environment"**
4. Procure por `DATABASE_URL`
5. **Se NÃO existir ou estiver incorreta**, clique em **"Add Environment Variable"** (ou edite):
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://user_entregas:C2OjukKx5anKGsMOICoYWxsrun3kDClQ@dpg-d3rsehk9c44c73avmah0-a/entregas_plus`
6. **Clique em "Save Changes"**

### 2️⃣ Forçar Novo Deploy

Vou preparar um arquivo para forçar o deploy. Execute estes comandos:

```bash
cd backend
git add render.yaml
git commit -m "Force: Trigger migration on deploy"
git push origin main
```

### 3️⃣ Aguardar e Verificar

1. Aguarde 5-10 minutos para o deploy
2. No Render Dashboard → Web Service → **Logs**
3. Procure por mensagens como:
   - "Running migrations..."
   - "Creating tables..."
   - "Apply migration usuarios.0001..."
4. Se aparecer, **sucesso!** 🎉

## 🚨 Se NÃO aparecer "Running migrations":

Execute no terminal local:

```bash
cd backend
python manage.py migrate
```

Isso vai revelar QUAL é o problema específico.

---

## ⚡ QUICK FIX - Alternativa Rápida:

Se quiser testar AGORA sem esperar:

1. Clone o repositório em outra pasta
2. Configure o DATABASE_URL localmente
3. Execute as migrações localmente (conectado ao banco do Render)

Quer que eu te ajude a fazer isso?

