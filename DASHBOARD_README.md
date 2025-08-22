# Dashboard de Gestão de Entregadores

## Funcionalidades Implementadas

### 1. Resumo Diário (Hoje)
- **Entregas Hoje**: Quantidade de entregas realizadas no dia atual
- **Não Entregas**: Quantidade de entregas não realizadas no dia atual  
- **Lucro Hoje**: Lucro líquido do dia (ganhos - despesas)

### 2. Indicadores de Performance
- **Dias Trabalhados**: Total de dias trabalhados no período selecionado
- **Entregas Realizadas**: Total de entregas realizadas no período
- **Entregas Não Realizadas**: Total de entregas não realizadas no período
- **Ganho Total**: Soma de todos os ganhos no período
- **Despesas Total**: Soma de todas as despesas no período
- **Lucro Líquido**: Ganho total - Despesas total

### 3. Filtros de Período
- **Semana**: Últimos 7 dias
- **Mês**: Últimos 30 dias
- Botão toggle para alternar entre os períodos

## Estrutura da API

### Endpoint: `/registro/api/dashboard-data/`
- **Método**: GET
- **Parâmetros**: 
  - `periodo`: 'semana' ou 'mes' (padrão: 'mes')

### Resposta da API
```json
{
  "success": true,
  "data": {
    "resumo_diario": {
      "entregas_hoje": 15,
      "nao_entregas_hoje": 2,
      "ganhos_hoje": 150.00,
      "despesas_hoje": 25.00,
      "lucro_hoje": 125.00
    },
    "indicadores_performance": {
      "dias_trabalhados": 22,
      "entregas_realizadas": 450,
      "entregas_nao_realizadas": 8,
      "ganho_total": 4500.00,
      "despesas_total": 350.00,
      "lucro_liquido": 4150.00
    },
    "periodo": "mes",
    "data_inicio": "01/08/2025",
    "data_fim": "21/08/2025"
  }
}
```

## Como Testar

### 1. Backend
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

### 2. Teste da API
```bash
cd backend
python teste_dashboard.py
```

### 3. Frontend
```bash
cd frontend
npm start
```

## Dados Utilizados

### Modelos do Banco
- **RegistroTrabalho**: Registros de dias de trabalho com entregas
- **Despesa**: Registros de despesas do entregador
- **Entregador**: Dados do usuário logado

### Cálculos Realizados
- **Ganhos**: Soma dos valores dos registros de trabalho
- **Despesas**: Soma dos valores das despesas
- **Lucro**: Ganhos - Despesas
- **Entregas**: Soma das quantidades de pacotes entregues
- **Dias Trabalhados**: Contagem de registros únicos de trabalho

## Melhorias Futuras

1. **Autenticação Real**: Implementar sistema de autenticação para identificar o entregador logado
2. **Filtros Avançados**: Adicionar filtros por data específica
3. **Gráficos**: Implementar visualizações gráficas dos dados
4. **Exportação**: Permitir exportar relatórios em PDF/Excel
5. **Notificações**: Alertas para metas não atingidas
6. **Comparação**: Comparar performance entre períodos

## Arquivos Modificados

### Backend
- `registro_entregadespesa/views.py`: Nova view `dashboard_data`
- `registro_entregadespesa/urls.py`: Endpoint do dashboard

### Frontend  
- `src/app/(home)/home.jsx`: Dashboard completo com dados reais
- `src/config/api.js`: Endpoint do dashboard
- `src/services/api.js`: Configuração da API

## Configuração

### IP do Servidor
O IP do servidor está configurado em `frontend/src/config/api.js`:
```javascript
BASE_URL: 'http://172.18.128.1:8000'
```

**Importante**: Ajuste este IP para o IP da sua máquina local para funcionar corretamente.

## URLs da API

### Endpoints Disponíveis
- **Dashboard**: `/registro/api/dashboard-data/`
- **Registro Trabalho**: `/registro/api/registro-trabalho/`
- **Registro Despesa**: `/registro/api/registro-despesa/`
- **Teste Conexão**: `/registro/api/test-connection/`

### Estrutura de URLs
```
http://[IP]:8000/registro/api/[endpoint]/
```

**Nota**: O prefixo `/registro/` é adicionado automaticamente pelo Django devido à configuração em `sistema/urls.py`.
