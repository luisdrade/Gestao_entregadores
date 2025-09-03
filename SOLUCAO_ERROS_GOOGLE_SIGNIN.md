# 🔧 SOLUÇÃO DE PROBLEMAS - Google Sign-In

## 🚨 Erros Comuns e Soluções

### 1. **Erro: "Google Play Services not available"**

**Causa:** Google Play Services não está instalado ou atualizado

**Soluções:**
```bash
# 1. Teste em dispositivo físico (não emulador)
# 2. Verifique se o Google Play Services está instalado
# 3. Atualize o Google Play Services na Play Store
# 4. Reinicie o dispositivo
```

### 2. **Erro: "Invalid client ID"**

**Causa:** Client ID incorreto ou SHA-1 não configurado

**Soluções:**
```bash
# 1. Verifique se o SHA-1 está correto no Google Console
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android

# 2. Verifique se o package name está correto
# Deve ser: com.luisdrade.gestaoentregadores

# 3. Verifique se o Client ID está correto no googleConfig.js
```

### 3. **Erro: "Network error"**

**Causa:** Problema de conexão ou backend não está rodando

**Soluções:**
```bash
# 1. Verifique se o backend está rodando
cd backend
python manage.py runserver

# 2. Verifique a URL da API no config/api.js
# Deve apontar para: http://10.20.13.125:8000

# 3. Teste a conexão com o backend
curl http://10.20.13.125:8000/api/test/
```

### 4. **Erro: "User cancelled"**

**Causa:** Usuário cancelou o processo de login

**Solução:** Normal, não é um erro real. O usuário pode tentar novamente.

### 5. **Erro: "Sign in failed"**

**Causa:** Configuração incorreta ou problema de permissões

**Soluções:**
```bash
# 1. Verifique se a API Google Sign-In está ativada
# 2. Verifique se as credenciais OAuth estão corretas
# 3. Verifique se o SHA-1 está no Google Console
# 4. Teste em dispositivo físico
```

## 🔍 DIAGNÓSTICO PASSO A PASSO

### Passo 1: Verificar Configuração
```bash
# Execute o script de diagnóstico
node diagnostico_google_signin.js
```

### Passo 2: Verificar SHA-1
```bash
# Windows
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android

# Linux/Mac
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### Passo 3: Verificar Google Console
1. Acesse: https://console.cloud.google.com/
2. Vá em "APIs & Services" > "Credentials"
3. Verifique se o SHA-1 está correto
4. Verifique se o package name está correto

### Passo 4: Testar Backend
```bash
cd backend
python manage.py runserver

# Em outro terminal, teste o endpoint
curl -X POST http://localhost:8000/api/auth/google-login/ \
  -H "Content-Type: application/json" \
  -d '{"id_token":"test","email":"test@test.com","nome":"Test","google_id":"123"}'
```

### Passo 5: Testar Frontend
```bash
cd frontend
npm start

# Teste em dispositivo físico (não emulador)
```

## 📋 CHECKLIST DE VERIFICAÇÃO

### ✅ Configuração Básica
- [ ] API Google Sign-In ativada
- [ ] Cliente OAuth 2.0 criado para Android
- [ ] SHA-1 fingerprint adicionado
- [ ] Package name configurado: `com.luisdrade.gestaoentregadores`
- [ ] Client ID configurado no `googleConfig.js`

### ✅ Dependências
- [ ] `@react-native-google-signin/google-signin` instalado
- [ ] Plugin configurado no `app.json`
- [ ] Backend com dependências do Google instaladas

### ✅ Teste
- [ ] Backend rodando na porta 8000
- [ ] Frontend rodando
- [ ] Testando em dispositivo físico
- [ ] Google Play Services instalado
- [ ] Internet funcionando

## 🚀 COMANDOS PARA TESTAR

### 1. Verificar SHA-1
```bash
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### 2. Iniciar Backend
```bash
cd backend
python manage.py runserver
```

### 3. Iniciar Frontend
```bash
cd frontend
npm start
```

### 4. Testar Endpoint
```bash
curl -X POST http://localhost:8000/api/auth/google-login/ \
  -H "Content-Type: application/json" \
  -d '{"id_token":"test","email":"test@test.com","nome":"Test","google_id":"123"}'
```

## 🔧 CONFIGURAÇÕES ESPECÍFICAS

### Google Console
- **Project ID**: Seu projeto
- **API**: Google Sign-In API ativada
- **Credentials**: OAuth 2.0 Client ID para Android
- **Package name**: `com.luisdrade.gestaoentregadores`
- **SHA-1**: Obtido do comando keytool

### Frontend
```javascript
// frontend/src/config/googleConfig.js
export const GOOGLE_CONFIG = {
  WEB_CLIENT_ID: '424994830272-fj72bna9gfo6scp8fsecmf2sp8aahvqg.apps.googleusercontent.com',
  IOS_CLIENT_ID: '424994830272-89dp1i7t49sq2l31okuu3uiiketfk053.apps.googleusercontent.com',
  OFFLINE_ACCESS: true,
  FORCE_CODE_FOR_REFRESH_TOKEN: true,
};
```

### Backend
```python
# backend/usuarios/views.py
class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        # Implementação do login com Google
```

## 📞 SUPORTE

Se o problema persistir:

1. **Execute o diagnóstico:**
   ```bash
   node diagnostico_google_signin.js
   ```

2. **Compartilhe:**
   - Mensagem de erro exata
   - Logs do console
   - Resultado do diagnóstico
   - Em que momento o erro acontece

3. **Verifique:**
   - SHA-1 está correto no Google Console
   - Package name está correto
   - Client ID está correto
   - Testando em dispositivo físico

## 🎯 PRÓXIMOS PASSOS

1. Execute o script de diagnóstico
2. Verifique o SHA-1
3. Teste em dispositivo físico
4. Verifique se o backend está rodando
5. Teste o login com Google

**Se ainda houver problemas, compartilhe a mensagem de erro exata!**




