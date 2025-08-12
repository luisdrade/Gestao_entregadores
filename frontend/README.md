# Gestão de Entregadores - Frontend React Native

Sistema de gestão para entregadores desenvolvido em React Native com Expo.

## 🚀 Funcionalidades

- **Autenticação JWT**: Login e registro com token JWT
- **Navegação**: Usando Expo Router com Stack Navigation
- **Telas Principais**:
  - Login
  - Cadastro
  - Esqueci a senha
  - Home (Dashboard)
  - Cadastro de Veículos
  - Entregas e Despesas
  - Relatórios
  - Comunidade

## 📱 Estrutura do Projeto

```
src/
├── app/                    # Expo Router (navegação)
│   ├── _layout.jsx        # Layout principal
│   ├── index.jsx          # Tela de login
│   ├── (auth)/            # Telas para usuários não logados
│   │   ├── register.jsx   # Cadastro
│   │   └── forgot-password.jsx # Esqueci a senha
│   └── (home)/            # Telas para usuários logados
│       ├── home.jsx       # Dashboard principal
│       ├── veiculos.jsx   # Cadastro de veículos
│       ├── entregas.jsx   # Entregas e despesas
│       ├── relatorios.jsx # Relatórios
│       └── comunidade.jsx # Comunidade
├── context/
│   └── AuthContext.jsx    # Contexto de autenticação
├── services/
│   └── api.js            # Configuração do Axios
└── config/
    └── api.js            # Configurações da API
```

## 🛠️ Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar URL da API
Edite o arquivo `src/config/api.js` e ajuste a `BASE_URL` conforme seu ambiente:

```javascript
// Para desenvolvimento local
BASE_URL: 'http://localhost:8000/api',

// Para emulador Android
// BASE_URL: 'http://10.0.2.2:8000/api',

// Para dispositivo físico (substitua pelo IP da sua máquina)
// BASE_URL: 'http://192.168.1.100:8000/api',
```

### 3. Executar o projeto
```bash
npm start
```

## 🔐 Autenticação

O sistema usa JWT tokens para autenticação:

- **Login**: `/auth/login/`
- **Registro**: `/auth/register/`
- **Esqueci a senha**: `/auth/forgot-password/`

Os tokens são armazenados no AsyncStorage e automaticamente incluídos nas requisições.

## 📋 Endpoints da API

### Autenticação
- `POST /auth/login/` - Login
- `POST /auth/register/` - Cadastro
- `POST /auth/forgot-password/` - Recuperar senha

### Veículos
- `GET /veiculos/` - Listar veículos
- `POST /veiculos/` - Criar veículo
- `GET /veiculos/{id}/` - Detalhes do veículo
- `PUT /veiculos/{id}/` - Atualizar veículo
- `DELETE /veiculos/{id}/` - Deletar veículo

### Entregas
- `GET /entregas/` - Listar entregas
- `POST /entregas/` - Criar entrega
- `GET /entregas/{id}/` - Detalhes da entrega
- `PUT /entregas/{id}/` - Atualizar entrega
- `DELETE /entregas/{id}/` - Deletar entrega

### Despesas
- `GET /despesas/` - Listar despesas
- `POST /despesas/` - Criar despesa
- `GET /despesas/{id}/` - Detalhes da despesa
- `PUT /despesas/{id}/` - Atualizar despesa
- `DELETE /despesas/{id}/` - Deletar despesa

### Relatórios
- `GET /relatorios/dashboard/` - Dashboard
- `GET /relatorios/entregas/` - Relatório de entregas
- `GET /relatorios/despesas/` - Relatório de despesas

### Comunidade
- `GET /comunidade/posts/` - Listar posts
- `POST /comunidade/posts/` - Criar post
- `GET /comunidade/posts/{id}/comments/` - Comentários do post

## 🎨 Tecnologias Utilizadas

- **React Native**: Framework principal
- **Expo**: Plataforma de desenvolvimento
- **Expo Router**: Navegação baseada em arquivos
- **Axios**: Cliente HTTP
- **AsyncStorage**: Armazenamento local
- **Formik**: Gerenciamento de formulários
- **Yup**: Validação de schemas
- **React Native Masked Text**: Máscaras de input

## 📱 Como Usar

1. **Login**: Digite email e senha para acessar o sistema
2. **Cadastro**: Crie uma nova conta com seus dados
3. **Dashboard**: Visualize resumo e acesse as funcionalidades
4. **Navegação**: Use os cards na tela home para acessar as diferentes seções
5. **Logout**: Clique em "Sair" no header para sair do sistema

## 🔧 Desenvolvimento

### Adicionando novas telas

1. Crie o arquivo na pasta apropriada (`(auth)` ou `(home)`)
2. Adicione a rota no `_layout.jsx`
3. Implemente a funcionalidade

### Modificando a API

1. Atualize os endpoints em `src/config/api.js`
2. Modifique os serviços conforme necessário

## 📝 Notas

- O sistema está configurado para trabalhar com o backend Django
- Certifique-se de que o backend está rodando na porta 8000
- Para desenvolvimento em dispositivo físico, ajuste o IP no arquivo de configuração
- O sistema usa AsyncStorage para persistir dados de autenticação


