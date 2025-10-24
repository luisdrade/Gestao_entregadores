# 🔍 Verificar Status do Banco de Dados

## 🚨 **Problema: Erro 400 no Admin**

### **Possíveis Causas:**
1. **Migrações não executaram** corretamente
2. **Banco vazio** (sem tabelas)
3. **Configurações de CSRF** incorretas
4. **Superusuário não criado**

## 🔧 **Soluções**

### **1. Verificar Logs do Render**
1. **Render Dashboard** → Seu Web Service
2. **Aba "Logs"**
3. **Procurar por**: "Running migrations..." ou erros

### **2. Verificar se Migrações Executaram**
**Nos logs, deve aparecer:**
```
Running migrations...
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, usuarios, cadastro_veiculo, comunidade, registro_entregadespesa, relatorios_dashboard
```

### **3. Se Migrações Não Executaram**
**Alterar Build Command para:**
```bash
pip install -r requirements.txt && python manage.py migrate --run-syncdb && python manage.py collectstatic --noinput
```

### **4. Criar Superusuário**
**Se migrações executaram, criar superusuário:**

**Opção A: Via API (Recomendado)**
```bash
# No terminal local
curl -X POST https://entregasplus.onrender.com/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@admin.com", "password": "admin123", "nome": "Admin"}'
```

**Opção B: Via Shell (Pago)**
- Render Dashboard → Web Service → "Shell"
- Execute: `python manage.py createsuperuser`

### **5. Testar API Diretamente**
```bash
# Testar se API está funcionando
curl https://entregasplus.onrender.com/api/
```

## 🎯 **Checklist de Verificação**

- [ ] Logs mostram migrações executando
- [ ] API responde com JSON
- [ ] Superusuário criado
- [ ] Admin carrega sem erro 400

## 🆘 **Se Ainda Der Erro**

### **Verificar Variáveis de Ambiente:**
- **DATABASE_URL**: Configurado corretamente
- **DEBUG**: False
- **ALLOWED_HOSTS**: Inclui seu domínio

### **Verificar Banco PostgreSQL:**
- **Render Dashboard** → Seu banco
- **Status**: "Available"
- **Connections**: Ativas

## 🚀 **Próximos Passos**

1. ✅ Verificar logs
2. ✅ Confirmar migrações
3. ✅ Criar superusuário
4. ✅ Testar admin
5. ✅ Configurar APK
