# 🚚 Sistema de Gestão de Entregadores

Sistema completo de gerenciamento para entregadores desenvolvido como Trabalho de Conclusão de Curso (TCC).

## 📋 Sobre o Projeto

Sistema web e mobile para gestão de entregadores, incluindo:
- 📱 **App Mobile** (React Native + Expo)
- 🌐 **Dashboard Web** (React + Vite)
- ⚙️ **Backend API** (Django REST Framework)

### Funcionalidades Principais

- ✅ Autenticação e autorização (2FA)
- ✅ Gestão de entregas e despesas
- ✅ Relatórios e dashboards
- ✅ Comunidade de entregadores
- ✅ Cadastro de veículos
- ✅ Painel administrativo

---

## 🏗️ Estrutura do Projeto

```
Gestao_entregadores/
├── backend/              # API Django REST Framework
├── frontend/            # App Mobile (React Native + Expo)
├── frontend-web/         # Dashboard Web (React + Vite)
├── docs/                 # Documentação do projeto
│   ├── deployment/      # Guias de deploy
│   ├── development/     # Guias de desenvolvimento
│   └── references/      # Referências bibliográficas
└── scripts/             # Scripts utilitários
```

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** (v18+)
- **Python** (3.10+)
- **PostgreSQL** ou **MySQL**
- **Git**

### Instalação

#### 1. Backend

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### 2. Frontend Mobile

```bash
cd frontend
npm install
npm start
```

#### 3. Frontend Web

```bash
cd frontend-web
npm install
npm run dev
```

---

## 📚 Documentação

### 📖 Para Entender o Projeto
- **[SOBRE_O_PROJETO.md](./SOBRE_O_PROJETO.md)** - Explicação simples e didática de tudo que o projeto faz (perfeito para iniciantes!)

### 📁 Documentação Técnica
Toda a documentação técnica está organizada na pasta [`docs/`](./docs/):

- 📦 **Deploy**: Guias completos de deploy em produção
- 🛠️ **Desenvolvimento**: Troubleshooting e guias de desenvolvimento
- 📖 **Referências**: Materiais de apoio e referências bibliográficas

Consulte o [`docs/README.md`](./docs/README.md) para mais detalhes.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- Django 4.x
- Django REST Framework
- PostgreSQL / MySQL
- JWT Authentication
- 2FA (Two-Factor Authentication)

### Frontend Mobile
- React Native
- Expo
- React Navigation (Expo Router)
- Axios
- Material-UI

### Frontend Web
- React 19
- Vite
- Material-UI (MUI)
- React Router
- Axios
- Recharts

---

## 📝 Scripts Úteis

### Sincronizar Variáveis de Ambiente

```bash
node scripts/sync-env.js
```

Sincroniza `API_BASE_URL` da raiz para os frontends.

---

## 🔧 Configuração

### Variáveis de Ambiente

Crie arquivos `.env` em cada módulo:

- **Raiz**: `.env` com `API_BASE_URL`
- **Frontend**: `frontend/.env` (gerado automaticamente)
- **Frontend Web**: `frontend-web/.env` (gerado automaticamente)
- **Backend**: `backend/.env` (consulte `backend/requirements.txt`)

---

## 📦 Deploy

Consulte a documentação completa em [`docs/deployment/deploy-completo.md`](./docs/deployment/deploy-completo.md).

### Plataformas Suportadas

- **Backend**: Render.com, Railway
- **Frontend Web**: Vercel, Netlify, Railway
- **Frontend Mobile**: Expo EAS Build

---

## 🤝 Contribuindo

Este é um projeto de TCC. Para sugestões ou melhorias, entre em contato.

---

## 📄 Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC).

---

## 👨‍💻 Autor

Desenvolvido como parte do Trabalho de Conclusão de Curso.

---

**Última atualização**: Novembro 2025
