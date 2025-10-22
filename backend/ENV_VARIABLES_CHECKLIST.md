# 🔐 Checklist: Variáveis de Ambiente no Render

## 📋 **Informações que Você Precisa Coletar**

### **1️⃣ DJANGO_SECRET_KEY**
**✅ Já gerado:**
```
DJANGO_SECRET_KEY=$(ws_4z&b%ip3&6r_ghx_za=eobfbaotro+e)aj1_+b5=_205m
```

### **2️⃣ DATABASE_URL**
**Onde encontrar:**
1. **Render Dashboard** → Seu banco PostgreSQL
2. **Aba "Info"** → **Internal Database URL**
3. **Copie** a URL completa

**Formato esperado:**
```
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
```

### **3️⃣ ALLOWED_HOSTS**
**Formato:**
```
ALLOWED_HOSTS=gestao-entregadores-backend.onrender.com,localhost,127.0.0.1
```

**Onde encontrar:**
- Após criar o Web Service
- URL será: `https://NOME-DO-SERVICE.onrender.com`

### **4️⃣ Variáveis Fixas (Copie e Cole)**
```env
DEBUG=False
STATIC_URL=/static/
STATIC_ROOT=/opt/render/project/src/staticfiles
MEDIA_URL=/media/
MEDIA_ROOT=/opt/render/project/src/media
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@gestaoentregadores.com
```

## 🎯 **Passo a Passo no Render**

### **1. Acessar Web Service**
1. **Dashboard** → Seu Web Service
2. **Aba "Environment"**
3. **"Add Environment Variable"**

### **2. Adicionar Cada Variável**
**Clique em "Add Environment Variable" para cada uma:**

#### **Variável 1:**
- **Key**: `DJANGO_SECRET_KEY`
- **Value**: `$(ws_4z&b%ip3&6r_ghx_za=eobfbaotro+e)aj1_+b5=_205m`

#### **Variável 2:**
- **Key**: `DATABASE_URL`
- **Value**: `postgresql://usuario:senha@host:porta/banco` (copie do banco)

#### **Variável 3:**
- **Key**: `DEBUG`
- **Value**: `False`

#### **Variável 4:**
- **Key**: `ALLOWED_HOSTS`
- **Value**: `gestao-entregadores-backend.onrender.com,localhost,127.0.0.1`

#### **Variável 5:**
- **Key**: `STATIC_URL`
- **Value**: `/static/`

#### **Variável 6:**
- **Key**: `STATIC_ROOT`
- **Value**: `/opt/render/project/src/staticfiles`

#### **Variável 7:**
- **Key**: `MEDIA_URL`
- **Value**: `/media/`

#### **Variável 8:**
- **Key**: `MEDIA_ROOT`
- **Value**: `/opt/render/project/src/media`

#### **Variável 9:**
- **Key**: `EMAIL_BACKEND`
- **Value**: `django.core.mail.backends.console.EmailBackend`

#### **Variável 10:**
- **Key**: `DEFAULT_FROM_EMAIL`
- **Value**: `noreply@gestaoentregadores.com`

## ✅ **Verificação Final**

**Após adicionar todas as variáveis, você deve ter:**
- [ ] DJANGO_SECRET_KEY
- [ ] DATABASE_URL
- [ ] DEBUG
- [ ] ALLOWED_HOSTS
- [ ] STATIC_URL
- [ ] STATIC_ROOT
- [ ] MEDIA_URL
- [ ] MEDIA_ROOT
- [ ] EMAIL_BACKEND
- [ ] DEFAULT_FROM_EMAIL

## 🚀 **Próximo Passo**
Após configurar todas as variáveis:
1. **Salve** as configurações
2. **Aguarde** o redeploy automático
3. **Execute** as migrações no Shell
4. **Teste** a API

## 🆘 **Se Algo Der Errado**
- **Verifique** se copiou a DATABASE_URL corretamente
- **Confirme** se o nome do Web Service está correto no ALLOWED_HOSTS
- **Verifique** os logs do Web Service
