# 🧪 Testar API no Render

## 🎯 **URLs para Testar**

### **1. Backend Principal**
```
https://gestao-entregadores-backend.onrender.com
```

### **2. Admin Django**
```
https://gestao-entregadores-backend.onrender.com/admin/
```

### **3. API Endpoints**
```
https://gestao-entregadores-backend.onrender.com/api/
```

## 🔍 **Testes Básicos**

### **1. Teste de Conectividade**
```bash
curl https://gestao-entregadores-backend.onrender.com
```

### **2. Teste da API**
```bash
curl https://gestao-entregadores-backend.onrender.com/api/
```

### **3. Teste de Health Check**
```bash
curl https://gestao-entregadores-backend.onrender.com/api/health/
```

## 📱 **Configurar Frontend**

### **Atualizar URL da API no React Native:**

```javascript
// src/config/api.js
const API_BASE_URL = 'https://gestao-entregadores-backend.onrender.com';

export default API_BASE_URL;
```

### **Atualizar em todos os serviços:**
```javascript
// src/services/authService.js
import API_BASE_URL from '../config/api';

const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    // ... resto do código
  });
};
```

## ✅ **Checklist de Testes**

- [ ] Backend responde na URL principal
- [ ] Admin Django carrega
- [ ] API endpoints funcionam
- [ ] Frontend conecta com nova URL
- [ ] Login funciona
- [ ] Todas as funcionalidades testadas

## 🆘 **Se Algo Não Funcionar**

### **Verificar Logs:**
- **Render Dashboard** → Web Service → "Logs"

### **Verificar Variáveis de Ambiente:**
- **Render Dashboard** → Web Service → "Environment"

### **Verificar Banco de Dados:**
- **Render Dashboard** → PostgreSQL → "Info"

## 🎉 **Próximos Passos**

1. ✅ Backend na nuvem
2. ✅ Banco PostgreSQL
3. ✅ SSL automático
4. 🔄 Testar todas as funcionalidades
5. 🔄 Atualizar frontend
6. 🔄 Deploy do frontend (se necessário)
