# Sistema de Autenticação - Backend

## 🚀 Visão Geral

Este sistema de autenticação foi implementado para o sistema de gestão de entregadores, permitindo:

- **Login/Logout** de usuários (admin e entregador)
- **Registro** de novos entregadores
- **Gerenciamento de perfis** de usuários
- **Controle de acesso** baseado em permissões
- **Autenticação JWT** segura

## 🏗️ Estrutura do Sistema

### Arquivos Principais

- `auth_views.py` - Views de autenticação organizadas
- `auth_serializers.py` - Serializers para validação de dados
- `models.py` - Modelo de usuário Entregador
- `urls.py` - Rotas da API
- `API_AUTH_DOCUMENTATION.md` - Documentação completa da API

### Modelo de Usuário

O sistema usa o modelo `Entregador` que herda de `AbstractBaseUser`:

```python
class Entregador(AbstractBaseUser, PermissionsMixin):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, unique=True)
    telefone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    # ... outros campos
    is_staff = models.BooleanField(default=False)  # Admin
    is_superuser = models.BooleanField(default=False)  # Super Admin
```

## 🔐 Tipos de Usuário

### 1. Entregador Normal
- `is_staff: false`
- `is_superuser: false`
- Acesso às funcionalidades básicas
- Pode gerenciar próprio perfil

### 2. Administrador
- `is_staff: true`
- `is_superuser: false`
- Acesso completo ao sistema
- Pode gerenciar todos os usuários

### 3. Super Administrador
- `is_staff: true`
- `is_superuser: true`
- Acesso total ao sistema
- Pode criar outros administradores

## 🛠️ Configuração e Uso

### 1. Ativar Ambiente Virtual

```bash
cd backend
venv\Scripts\activate
```

### 2. Verificar Dependências

```bash
pip install -r requirements.txt
```

### 3. Executar Migrações

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Testar o Sistema

```bash
python test_auth_system.py
```

### 5. Executar o Servidor

```bash
python manage.py runserver
```

## 📡 Endpoints da API

### Autenticação Básica

| Método | Endpoint | Descrição | Permissão |
|--------|----------|------------|-----------|
| POST | `/api/auth/login/` | Login de usuário | Público |
| POST | `/api/auth/register/` | Registro de entregador | Público |
| POST | `/api/auth/logout/` | Logout | Autenticado |
| POST | `/api/auth/refresh/` | Renovar token | Público |

### Perfil do Usuário

| Método | Endpoint | Descrição | Permissão |
|--------|----------|------------|-----------|
| GET | `/api/auth/profile/` | Obter perfil | Autenticado |
| PUT | `/api/auth/profile/` | Atualizar perfil | Autenticado |
| POST | `/api/auth/change-password/` | Alterar senha | Autenticado |

### Administração

| Método | Endpoint | Descrição | Permissão |
|--------|----------|------------|-----------|
| GET | `/api/admin/users/` | Listar usuários | Admin |
| POST | `/api/admin/users/` | Criar usuário | Admin |

## 🧪 Testando o Sistema

### 1. Usuários de Teste

O script `test_auth_system.py` cria automaticamente:

**Super Admin:**
- Email: `admin@entregasplus.com`
- Senha: `admin123`

**Entregador:**
- Email: `entregador@teste.com`
- Senha: `entregador123`

### 2. Teste de Login

```bash
# Testar login do admin
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@entregasplus.com", "password": "admin123"}'

# Testar login do entregador
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "entregador@teste.com", "password": "entregador123"}'
```

### 3. Teste de Registro

```bash
# Registrar novo entregador
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@exemplo.com",
    "password": "senha123",
    "password_confirm": "senha123",
    "cpf": "222.333.444-55",
    "telefone": "(11) 22222-2222"
  }'
```

## 🔒 Segurança

### Validações Implementadas

- **Senha**: Validação de força e confirmação
- **CPF**: Único no sistema
- **Email**: Único no sistema
- **Username**: Único (opcional)
- **Permissões**: Controle de acesso baseado em `is_staff`

### Autenticação JWT

- **Access Token**: Válido por 1 dia
- **Refresh Token**: Válido por 7 dias
- **Headers**: `Authorization: Bearer <token>`

## 📝 Exemplos de Uso

### Frontend JavaScript

```javascript
// Login
const login = async (email, password) => {
    const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Salvar tokens
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        
        // Redirecionar baseado no tipo
        if (data.user.user_type === 'admin') {
            window.location.href = '/admin-dashboard';
        } else {
            window.location.href = '/entregador-dashboard';
        }
    }
    
    return data;
};

// Requisição autenticada
const getProfile = async () => {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('/api/auth/profile/', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return await response.json();
};
```

### Python Requests

```python
import requests

# Login
def login(email, password):
    response = requests.post('http://localhost:8000/api/auth/login/', json={
        'email': email,
        'password': password
    })
    return response.json()

# Requisição autenticada
def get_profile(access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get('http://localhost:8000/api/auth/profile/', headers=headers)
    return response.json()

# Uso
login_data = login('admin@entregasplus.com', 'admin123')
if login_data['success']:
    access_token = login_data['tokens']['access']
    profile = get_profile(access_token)
    print(profile)
```

## 🚨 Solução de Problemas

### Erro: "No module named 'rest_framework_simplejwt'"

```bash
pip install djangorestframework-simplejwt
```

### Erro: "No module named 'cryptography'"

```bash
pip install cryptography
```

### Erro: "No module named 'requests'"

```bash
pip install requests
```

### Erro de Migração

```bash
python manage.py makemigrations
python manage.py migrate
```

### Erro de Banco de Dados

Verificar se o MySQL está rodando e as credenciais estão corretas em `settings.py`.

## 📚 Documentação Adicional

- **API Completa**: `API_AUTH_DOCUMENTATION.md`
- **Django REST Framework**: https://www.django-rest-framework.org/
- **JWT**: https://django-rest-framework-simplejwt.readthedocs.io/

## 🤝 Contribuição

Para adicionar novas funcionalidades:

1. Crie as views em `auth_views.py`
2. Crie os serializers em `auth_serializers.py`
3. Adicione as URLs em `urls.py`
4. Atualize a documentação
5. Teste com o script de teste

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs em `debug.log`
2. Execute `python test_auth_system.py`
3. Verifique se todas as dependências estão instaladas
4. Consulte a documentação da API
