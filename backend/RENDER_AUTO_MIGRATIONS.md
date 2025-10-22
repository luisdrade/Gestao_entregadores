# 🔄 Migrações Automáticas no Render (Sem Shell)

## 💰 **Problema: Shell é Pago**
- Shell do Render custa $7/mês
- Mas podemos fazer migrações automáticas!

## ✅ **Solução: Build Command Automático**

### **1. Alterar Build Command**

**No painel do Render:**
1. **Web Service** → "Settings"
2. **Encontre**: "Build Command"
3. **Altere para**:
```bash
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

### **2. Verificar Start Command**
**Deve estar**:
```bash
gunicorn sistema.wsgi
```

## 🚀 **Como Funciona**

### **Durante o Deploy:**
1. **Instala** dependências
2. **Executa** migrações automaticamente
3. **Coleta** arquivos estáticos
4. **Inicia** o servidor

### **Vantagens:**
- ✅ **Gratuito** (sem shell)
- ✅ **Automático** a cada deploy
- ✅ **Sempre atualizado**

## 🔧 **Configuração Completa**

### **Build Command:**
```bash
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

### **Start Command:**
```bash
gunicorn sistema.wsgi
```

### **Root Directory:**
```
backend
```

## 🧪 **Testar**

### **1. Salvar Configurações**
- **Clique**: "Save Changes"
- **Aguarde**: Redeploy automático

### **2. Verificar Logs**
- **Web Service** → "Logs"
- **Deve aparecer**: "Running migrations..."

### **3. Testar API**
- **URL**: `https://gestao-entregadores-backend.onrender.com`
- **Admin**: `https://gestao-entregadores-backend.onrender.com/admin/`

## ⚠️ **Se Der Erro nas Migrações**

### **Problema Comum: Banco Vazio**
Se der erro de tabelas não existem:

### **Solução: Reset Migrações**
**Alterar Build Command para**:
```bash
pip install -r requirements.txt && python manage.py migrate --run-syncdb && python manage.py collectstatic --noinput
```

## 🎯 **Vantagens desta Abordagem**

- ✅ **Gratuito** (sem shell pago)
- ✅ **Automático** a cada deploy
- ✅ **Sempre sincronizado**
- ✅ **Fácil de manter**

## 🚀 **Próximos Passos**

1. ✅ Configurar Build Command
2. ✅ Aguardar redeploy
3. ✅ Testar API
4. ✅ Configurar frontend
5. ✅ Deploy completo!

## 📱 **Configurar Frontend**

Após testar a API, atualize o frontend:

```javascript
// src/config/api.js
const API_BASE_URL = 'https://gestao-entregadores-backend.onrender.com';
```

## 🎉 **Resultado Final**

- ✅ Backend na nuvem
- ✅ Banco PostgreSQL
- ✅ Migrações automáticas
- ✅ SSL gratuito
- ✅ Deploy automático
- ✅ Sem custos adicionais!
