# Gestão de Entregadores

Sistema completo para gerenciamento de entregadores, incluindo registro de trabalho, controle de despesas e dashboard com KPIs.

## 🚀 Funcionalidades

### Frontend (React Native + Expo)
- **Dashboard**: Visualização de KPIs em tempo real
- **Registro de Trabalho**: Formulário para registrar dia de trabalho
- **Controle Financeiro**: Registro e controle de despesas
- **Relatórios**: Visualização de estatísticas e relatórios
- **Navegação por Abas**: Interface moderna com navegação intuitiva

### Backend (Django)
- **API REST**: Endpoints para todas as funcionalidades
- **Modelos de Dados**: 
  - Registro de trabalho diário
  - Controle de despesas
  - Sistema de usuários
- **Admin Django**: Interface administrativa completa

## 📱 Telas Implementadas

### 1. Dashboard
- KPIs em cards coloridos
- Estatísticas de entregas realizadas/não realizadas
- Lucro líquido
- Botões de ação rápida

### 2. Registro de Trabalho
- Data e horários de início/fim
- Quantidade de entregas (realizadas e não realizadas)
- Tipo de pagamento
- Valor recebido

### 3. Controle Financeiro
- Categorização de despesas
- Descrição detalhada
- Valor e data
- Controle de gastos

### 4. Relatórios
- Estatísticas detalhadas
- Análise de performance
- Histórico de atividades

## 🛠️ Tecnologias

### Frontend
- React Native
- Expo Router
- React Native Vector Icons
- Axios para APIs

### Backend
- Django 4.x
- Django REST Framework
- SQLite (desenvolvimento)
- PostgreSQL (produção)

## 🚀 Como Executar

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npx expo start
```

## 📊 Estrutura do Projeto

```
Gestao_entregadores/
├── backend/
│   ├── registro_entregadespesa/  # App principal
│   ├── usuarios/                  # Sistema de usuários
│   ├── sistema/                   # Configurações Django
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── (home)/           # Telas principais
│   │   ├── services/             # APIs
│   │   └── context/              # Contexto de autenticação
│   └── package.json
└── README.md
```

## 🔌 APIs Disponíveis

### Registro de Trabalho
- `POST /api/registro-trabalho/`
- Dados: data, horários, quantidades, tipo de pagamento, valor

### Registro de Despesa
- `POST /api/registro-despesa/`
- Dados: tipo, descrição, valor, data

### Dashboard
- `GET /api/dashboard-data/`
- Retorna: KPIs e estatísticas

## 🎨 Design System

- **Cores**: Azul (#007AFF) como cor principal
- **Tipografia**: Sistema hierárquico com pesos variados
- **Componentes**: Cards, botões e inputs padronizados
- **Navegação**: Sistema de abas com indicadores visuais

## 🔮 Próximas Funcionalidades

- [ ] Autenticação JWT
- [ ] Push notifications
- [ ] Relatórios em PDF
- [ ] Gráficos interativos
- [ ] Sincronização offline
- [ ] Múltiplos idiomas

## 📝 Licença

Este projeto é parte de um TCC (Trabalho de Conclusão de Curso) e está sob licença educacional.

## 👨‍💻 Desenvolvido por

Sistema desenvolvido como projeto de TCC para Gestão de Entregadores.
