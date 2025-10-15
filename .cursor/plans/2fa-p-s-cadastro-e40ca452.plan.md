<!-- e40ca452-83cf-42c8-8c85-84bfefbd6dab 39477ba4-8780-46ea-84f2-dccff6d9deb9 -->
# Implementação de 2FA Obrigatório Após Cadastro

## Resumo

Adicionar verificação 2FA obrigatória imediatamente após o cadastro do usuário, com opção de envio por email ou SMS/celular. O usuário não receberá tokens JWT até validar o código, bloqueando completamente o acesso. Limite de 5 tentativas de reenvio com bloqueio de 5 minutos.

## Backend - Modificações

### 1. Modelo de Usuário (`backend/usuarios/models.py`)

- Adicionar campos ao modelo `Entregador`:
  - `registration_verified` (BooleanField): indica se completou verificação pós-cadastro
  - `registration_code` (CharField): código temporário de verificação
  - `registration_code_expires_at` (DateTimeField): expiração do código
  - `registration_code_attempts` (IntegerField): contador de tentativas de reenvio
  - `registration_code_blocked_until` (DateTimeField): bloqueio temporário por excesso de tentativas

### 2. Serviço de SMS (`backend/usuarios/sms_service.py` - NOVO)

- Criar nova classe `SMSService` para envio de códigos via SMS
- Integrar com provedor de SMS (Twilio, AWS SNS, ou similar)
- Método `send_registration_code(user, phone_number)` 
- Método `verify_code(user, code)`
- Seguir mesmo padrão do `TwoFactorEmailService`

### 3. Serviço Unificado de Verificação (`backend/usuarios/registration_verification_service.py` - NOVO)

- Criar classe `RegistrationVerificationService` que:
  - Gera código de 6 dígitos
  - Gerencia tentativas de reenvio (max 5 em 5 minutos)
  - Delega envio para `TwoFactorEmailService` ou `SMSService` conforme escolha do usuário
  - Valida código e atualiza `registration_verified=True`
  - Implementa lógica de bloqueio temporário por excesso de tentativas

### 4. Atualizar `RegisterView` (`backend/usuarios/auth_views.py`)

Modificar resposta do cadastro em **linhas 163-183**:

```python
# Após criar usuário, NÃO gerar tokens JWT ainda
# Enviar código de verificação por email/SMS conforme escolha
# Retornar:
{
  'success': True,
  'message': 'Cadastro realizado. Código de verificação enviado.',
  'requires_verification': True,
  'user_email': user.email,
  'user_phone': user.telefone,
  'verification_method': 'email' or 'sms' (conforme escolha do user)
}
```

### 5. Nova View de Verificação Pós-Cadastro (`backend/usuarios/auth_views.py`)

Criar `RegistrationVerifyView`:

- Endpoint: `POST /api/auth/register/verify/`
- Recebe: `email`, `code`, `verification_method`
- Valida código usando `RegistrationVerificationService`
- Se válido: marca `registration_verified=True`, gera e retorna tokens JWT + dados do usuário
- Se inválido: retorna erro com contador de tentativas restantes

### 6. Nova View de Reenvio de Código (`backend/usuarios/auth_views.py`)

Criar `RegistrationResendView`:

- Endpoint: `POST /api/auth/register/resend/`
- Recebe: `email`, `verification_method` (email ou sms)
- Verifica se não está bloqueado temporariamente
- Incrementa contador de tentativas
- Se atingir 5 tentativas: bloqueia por 5 minutos
- Reenvia código via método escolhido

### 7. Atualizar URLs (`backend/usuarios/urls.py`)

Adicionar novos endpoints após linha 41:

```python
path('auth/register/verify/', RegistrationVerifyView.as_view(), name='auth_register_verify'),
path('auth/register/resend/', RegistrationResendView.as_view(), name='auth_register_resend'),
```

### 8. Template de Email (`backend/templates/emails/registration_verification.html` - NOVO)

- Criar template HTML para email de verificação pós-cadastro
- Deve conter: nome do usuário, código de 6 dígitos, tempo de expiração (10 minutos)

## Frontend - Modificações

### 9. Atualizar `AuthContext` (`frontend/src/context/AuthContext.jsx`)

- Modificar função `signUp` (linhas 237-249) para lidar com resposta de verificação pendente
- Retornar informação de que precisa verificação
- Não salvar tokens até verificação completa

### 10. Modificar Tela de Registro (`frontend/src/app/(auth)/register.jsx`)

- Após cadastro bem-sucedido que retorna `requires_verification: true`
- Navegar para tela de verificação pós-cadastro ao invés de voltar para login
- Passar dados necessários (email, telefone, método escolhido)

### 11. Nova Tela de Escolha de Método (`frontend/src/app/(auth)/register-verification-method.jsx` - NOVO)

- Tela intermediária exibida após cadastro
- Permite usuário escolher entre:
  - Receber código via Email (mostra email mascarado: `j***@gmail.com`)
  - Receber código via SMS (mostra telefone mascarado: `(**) ****-1234`)
- Botões de seleção estilizados
- Ao selecionar, envia requisição para backend gerar e enviar código
- Navega para tela de inserção de código

### 12. Nova Tela de Verificação (`frontend/src/app/(auth)/register-verify-code.jsx` - NOVO)

- Campos para inserir código de 6 dígitos (input numérico)
- Timer mostrando tempo restante (10 minutos)
- Botão "Verificar Código"
- Botão "Reenviar Código" (com contador de tentativas)
- Mensagem de erro se código inválido
- Mensagem de bloqueio se exceder 5 tentativas
- Loading durante verificação
- Ao validar com sucesso: salva tokens no AsyncStorage e navega para home

### 13. Atualizar `api.js` (`frontend/src/config/api.js`)

Adicionar novos endpoints em `AUTH` (após linha 21):

```javascript
REGISTER_VERIFY: '/api/auth/register/verify/',
REGISTER_RESEND: '/api/auth/register/resend/',
```

### 14. Componente de Input de Código (`frontend/src/components/CodeInput.jsx` - NOVO)

- Componente reutilizável com 6 campos individuais para dígitos
- Auto-foco no próximo campo ao digitar
- Estilo consistente com design do app
- Props: `value`, `onChange`, `error`

## Fluxo Completo

1. **Usuário preenche formulário de cadastro** → tela `register.jsx`
2. **Submit do formulário** → `POST /api/auth/register/`
3. **Backend cria usuário** mas deixa `registration_verified=False`, retorna `requires_verification: true`
4. **Frontend navega** para `register-verification-method.jsx`
5. **Usuário escolhe** Email ou SMS
6. **Frontend envia escolha** → backend gera código e envia via método escolhido
7. **Frontend navega** para `register-verify-code.jsx`
8. **Usuário digita código** recebido
9. **Submit do código** → `POST /api/auth/register/verify/`
10. **Backend valida**:

    - ✅ Código correto → marca `registration_verified=True`, gera tokens JWT, retorna
    - ❌ Código errado → retorna erro, decrementa tentativas

11. **Frontend com código válido** → salva tokens, atualiza AuthContext, navega para home
12. **Se precisar reenviar** → botão chama `POST /api/auth/register/resend/` (limite 5x em 5min)

## Arquivos Principais a Modificar

**Backend:**

- `backend/usuarios/models.py` (campos novos)
- `backend/usuarios/auth_views.py` (RegisterView, 2 views novas)
- `backend/usuarios/registration_verification_service.py` (NOVO)
- `backend/usuarios/sms_service.py` (NOVO)
- `backend/usuarios/urls.py` (2 endpoints novos)
- `backend/usuarios/email_service.py` (adicionar método para email de registro)
- `backend/templates/emails/registration_verification.html` (NOVO)

**Frontend:**

- `frontend/src/app/(auth)/register.jsx` (navegação pós-cadastro)
- `frontend/src/app/(auth)/register-verification-method.jsx` (NOVO)
- `frontend/src/app/(auth)/register-verify-code.jsx` (NOVO)
- `frontend/src/components/CodeInput.jsx` (NOVO)
- `frontend/src/context/AuthContext.jsx` (função signUp)
- `frontend/src/config/api.js` (endpoints novos)

## Segurança e Validações

- Código expira em 10 minutos
- Máximo 5 tentativas de reenvio em janela de 5 minutos
- Bloqueio temporário de 5 minutos após exceder limite
- Código de 6 dígitos numéricos gerado com `secrets.randbelow()`
- Validação no backend se usuário já está verificado (evitar reuso)
- Limpeza automática de códigos expirados

### To-dos

- [ ] Adicionar campos de verificação de registro ao modelo Entregador
- [ ] Criar SMSService para envio de códigos via SMS
- [ ] Criar RegistrationVerificationService para gerenciar códigos e tentativas
- [ ] Criar template HTML de email para verificação pós-cadastro
- [ ] Modificar RegisterView para enviar código ao invés de tokens JWT
- [ ] Criar RegistrationVerifyView para validar código e gerar tokens
- [ ] Criar RegistrationResendView com limite de tentativas
- [ ] Adicionar novos endpoints de verificação nas URLs
- [ ] Criar e aplicar migrations dos novos campos
- [ ] Adicionar novos endpoints em api.js
- [ ] Criar componente CodeInput reutilizável para 6 dígitos
- [ ] Criar tela de escolha de método (email ou SMS)
- [ ] Criar tela de inserção e verificação de código
- [ ] Atualizar AuthContext para lidar com verificação pendente
- [ ] Modificar tela de registro para navegar para verificação
- [ ] Testar fluxo completo de cadastro com verificação 2FA