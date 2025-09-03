# Configuração do Google Sign-In

Este guia irá te ajudar a configurar o login/registro com Google no seu aplicativo.

## 1. Configuração no Google Cloud Console

### 1.1 Criar/Configurar Projeto
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API "Google Sign-In API"

### 1.2 Configurar Credenciais OAuth 2.0
1. Vá em "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure as URLs autorizadas:

#### Para Android:
- Adicione o SHA-1 fingerprint do seu projeto
- Para obter o SHA-1, execute no terminal:
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

#### Para iOS:
- Adicione o Bundle ID do seu projeto
- Encontre no arquivo `app.json` ou `app.config.js`

#### Para Web:
- Adicione o domínio do seu backend (ex: `http://10.20.13.125:8000`)

### 1.3 Obter os IDs
Após criar as credenciais, você receberá:
- **Web Client ID** (obrigatório para Android)
- **iOS Client ID** (opcional, apenas para iOS)

## 2. Configuração no Frontend

### 2.1 Atualizar Configuração
Edite o arquivo `frontend/src/config/googleConfig.js`:

```javascript
export const GOOGLE_CONFIG = {
  // Substitua pelos seus IDs reais
  WEB_CLIENT_ID: 'SEU_WEB_CLIENT_ID.apps.googleusercontent.com',
  IOS_CLIENT_ID: 'SEU_IOS_CLIENT_ID.apps.googleusercontent.com',
  
  OFFLINE_ACCESS: true,
  FORCE_CODE_FOR_REFRESH_TOKEN: true,
};
```

### 2.2 Verificar Dependências
Certifique-se de que a dependência está instalada:
```bash
cd frontend
npm install @react-native-google-signin/google-signin
```

## 3. Configuração no Backend

### 3.1 Instalar Dependências
No diretório `backend`, instale as dependências do Google:
```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2
```

### 3.2 Executar Migrações
Após adicionar o campo `google_id` ao modelo, execute:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3.3 Configurar Variáveis de Ambiente (Opcional)
Se quiser verificar tokens no backend, adicione no `settings.py`:
```python
GOOGLE_CLIENT_ID = 'SEU_WEB_CLIENT_ID.apps.googleusercontent.com'
```

## 4. Testando a Implementação

### 4.1 Frontend
1. Inicie o aplicativo: `npm start`
2. Na tela de login, clique em "Continuar com Google"
3. Selecione uma conta Google
4. Verifique se o login funciona

### 4.2 Backend
1. Inicie o servidor: `python manage.py runserver`
2. Teste os endpoints:
   - `POST /api/auth/google-login/`
   - `POST /api/auth/google-register/`

## 5. Funcionalidades Implementadas

### 5.1 Login com Google
- ✅ Botão "Continuar com Google" na tela de login
- ✅ Autenticação via Google OAuth
- ✅ Criação automática de conta se não existir
- ✅ Login automático se conta já existir
- ✅ Salvamento de foto de perfil do Google

### 5.2 Registro com Google
- ✅ Criação de nova conta com dados do Google
- ✅ Salvamento de informações: nome, email, foto
- ✅ Geração automática de token JWT
- ✅ Integração com sistema de autenticação existente

### 5.3 Banco de Dados
- ✅ Campo `google_id` adicionado ao modelo Entregador
- ✅ Salvamento de foto de perfil do Google
- ✅ Vinculação de conta Google com conta local

## 6. Estrutura de Dados

### 6.1 Dados Salvos do Google
```javascript
{
  id: "google_user_id",
  nome: "Nome do Usuário",
  email: "usuario@gmail.com",
  foto: "https://lh3.googleusercontent.com/...",
  google_id: "123456789"
}
```

### 6.2 Resposta do Backend
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "nome": "Nome do Usuário",
    "email": "usuario@gmail.com",
    "foto": "https://lh3.googleusercontent.com/...",
    "google_id": "123456789",
    "cpf": null,
    "telefone": null
  }
}
```

## 7. Solução de Problemas

### 7.1 Erro "Google Play Services not available"
- Verifique se o Google Play Services está instalado
- Teste em um dispositivo físico (não emulador)

### 7.2 Erro "Invalid client ID"
- Verifique se o Web Client ID está correto
- Certifique-se de que o SHA-1 está configurado no Google Console

### 7.3 Erro "Network error"
- Verifique a conexão com a internet
- Teste se o backend está rodando

### 7.4 Erro "User cancelled"
- Usuário cancelou o processo de login
- Normal, não é um erro real

## 8. Próximos Passos

1. **Configurar IDs reais** no `googleConfig.js`
2. **Testar em dispositivo físico** (recomendado)
3. **Personalizar UI** do botão Google se necessário
4. **Adicionar validação de token** no backend (opcional)
5. **Implementar logout do Google** (já implementado)

## 9. Arquivos Modificados

### Frontend:
- `frontend/src/services/googleAuth.js` (novo)
- `frontend/src/config/googleConfig.js` (novo)
- `frontend/src/config/api.js` (atualizado)
- `frontend/src/context/AuthContext.jsx` (atualizado)
- `frontend/src/app/index.jsx` (atualizado)

### Backend:
- `backend/usuarios/models.py` (atualizado)
- `backend/usuarios/views.py` (atualizado)
- `backend/usuarios/urls.py` (atualizado)

## 10. Comandos Úteis

```bash
# Frontend
cd frontend
npm install
npm start

# Backend
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```


