# Solução para Erro 404 no Dashboard

## Problema Identificado

O erro 404 estava ocorrendo porque as URLs do dashboard estavam sendo incluídas com o prefixo `registro/` no Django, mas o frontend estava tentando acessar `/api/dashboard-data/` em vez de `/registro/api/dashboard-data/`.

## Soluções Implementadas

### 1. ✅ Corrigido o Endpoint no Frontend
**Arquivo**: `frontend/src/config/api.js`
```javascript
// ANTES (incorreto)
DASHBOARD: '/api/dashboard-data/',

// DEPOIS (correto)
DASHBOARD: '/registro/api/dashboard-data/',
```

### 2. ✅ Adicionado Endpoint de Teste
**Arquivo**: `backend/registro_entregadespesa/views.py`
- Nova view `test_dashboard_endpoint` para testes
- Adicionada nas URLs como `/registro/api/test-dashboard/`

### 3. ✅ Configurações de CORS Atualizadas
**Arquivo**: `backend/sistema/settings.py`
- Adicionado IP `172.18.128.1` nas origens permitidas
- Atualizada regex pattern para incluir IPs 172.18.x.x

## Como Testar

### 1. Reinicie o Servidor Django
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

### 2. Teste os Endpoints
```bash
cd backend
python teste_curl.py
```

### 3. Verifique no Navegador
Acesse: `http://172.18.128.1:8000/registro/api/test-dashboard/`

## URLs Corretas da API

| Endpoint | URL Completa | Descrição |
|----------|---------------|-----------|
| Dashboard | `/registro/api/dashboard-data/` | Dados do dashboard |
| Teste | `/registro/api/test-dashboard/` | Endpoint de teste |
| Conexão | `/registro/api/test-connection/` | Teste de banco |
| Trabalho | `/registro/api/registro-trabalho/` | Registro de trabalho |
| Despesa | `/registro/api/registro-despesa/` | Registro de despesa |

## Estrutura de URLs no Django

```
sistema/urls.py
└── path('registro/', include('registro_entregadespesa.urls'))
    └── registro_entregadespesa/urls.py
        └── path('api/dashboard-data/', views.dashboard_data)
```

**Resultado**: `/registro/` + `/api/dashboard-data/` = `/registro/api/dashboard-data/`

## Verificações Adicionais

### 1. Verifique se o Servidor está Rodando
```bash
curl http://172.18.128.1:8000/
```

### 2. Verifique se as URLs estão Funcionando
```bash
curl http://172.18.128.1:8000/registro/api/test-dashboard/
```

### 3. Verifique o Log do Django
Procure por erros no terminal onde o servidor está rodando.

## Se Ainda Der Erro 404

### 1. Verifique as URLs do Django
```bash
cd backend
python manage.py show_urls | grep dashboard
```

### 2. Verifique se o App está Instalado
```bash
python manage.py check
```

### 3. Verifique se há Erros de Sintaxe
```bash
python manage.py validate
```

## Teste Final

Após aplicar todas as correções:

1. **Backend**: `python manage.py runserver 0.0.0.0:8000`
2. **Frontend**: `npm start`
3. **Teste**: Acesse o dashboard no app

O erro 404 deve estar resolvido e o dashboard deve carregar os dados corretamente.
