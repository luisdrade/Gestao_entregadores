# 🔧 API de Moderação da Comunidade

## 📋 **Visão Geral**

Sistema de moderação implementado para que apenas administradores (`is_staff=True`) possam gerenciar o conteúdo da comunidade, incluindo postagens e anúncios de veículos.

## 🚀 **Funcionalidades Implementadas**

### ✅ **Sistema de Moderação**
- **Status dos posts**: `aprovado`, `pendente`, `rejeitado`, `removido`
- **Controle de visibilidade**: Posts só aparecem se `status='aprovado'` e `is_visivel=True`
- **Auditoria completa**: Quem moderou, quando e por quê
- **Logs de atividades**: Todas as ações são registradas

### ✅ **APIs de Admin**
- Listagem de conteúdo com filtros
- Moderação individual (aprovar/rejeitar/remover)
- Exclusão permanente
- Estatísticas detalhadas

## 📡 **Endpoints da API**

### **1. Listar Conteúdo para Moderação**
```http
GET /comunidade/admin/
```

**Parâmetros de Query:**
- `tipo`: `all`, `postagens`, `anuncios`
- `status`: `all`, `aprovado`, `pendente`, `rejeitado`, `removido`
- `search`: busca por título, autor, conteúdo
- `page`: página (padrão: 1)
- `per_page`: itens por página (padrão: 10)

**Exemplo:**
```http
GET /comunidade/admin/?tipo=postagens&status=pendente&search=spam&page=1&per_page=20
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "postagens": [
      {
        "id": 1,
        "autor": "João Silva",
        "titulo": "Dicas de entrega",
        "conteudo": "Conteúdo da postagem...",
        "data_criacao": "2024-01-15T10:30:00Z",
        "status": "pendente",
        "status_display": "Pendente",
        "moderado_por": null,
        "moderado_por_nome": null,
        "data_moderacao": null,
        "motivo_moderacao": null,
        "is_visivel": true
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 10,
      "total": 25,
      "total_pages": 3
    }
  }
}
```

### **2. Moderar Postagem**
```http
PATCH /comunidade/admin/postagens/{id}/
```

**Body:**
```json
{
  "status": "aprovado",
  "motivo": "Conteúdo adequado para a comunidade"
}
```

**Status disponíveis:**
- `aprovado`: Post fica visível
- `pendente`: Aguardando moderação
- `rejeitado`: Post rejeitado (não visível)
- `removido`: Post removido (não visível)

**Resposta:**
```json
{
  "success": true,
  "message": "Postagem aprovada com sucesso",
  "data": {
    "id": 1,
    "autor": "João Silva",
    "titulo": "Dicas de entrega",
    "status": "aprovado",
    "moderado_por": 1,
    "moderado_por_nome": "Admin Sistema",
    "data_moderacao": "2024-01-15T11:00:00Z",
    "motivo_moderacao": "Conteúdo adequado para a comunidade"
  }
}
```

### **3. Moderar Anúncio**
```http
PATCH /comunidade/admin/anuncios/{id}/
```

**Body:**
```json
{
  "status": "rejeitado",
  "motivo": "Preço muito alto para o mercado"
}
```

### **4. Deletar Postagem Permanentemente**
```http
DELETE /comunidade/admin/postagens/{id}/
```

**Resposta:**
```json
{
  "success": true,
  "message": "Postagem deletada permanentemente"
}
```

### **5. Deletar Anúncio Permanentemente**
```http
DELETE /comunidade/admin/anuncios/{id}/
```

### **6. Estatísticas da Comunidade**
```http
GET /comunidade/admin/stats/
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "postagens": {
      "total": 150,
      "aprovadas": 120,
      "pendentes": 15,
      "rejeitadas": 10,
      "removidas": 5,
      "ultimo_mes": 25
    },
    "anuncios": {
      "total": 80,
      "aprovados": 70,
      "pendentes": 5,
      "rejeitados": 3,
      "removidos": 2,
      "ultimo_mes": 12
    },
    "total_conteudo": 230,
    "conteudo_pendente": 20
  }
}
```

## 🔐 **Segurança**

### **Autenticação Obrigatória**
- Todas as rotas de admin requerem autenticação JWT
- Apenas usuários com `is_staff=True` podem acessar

### **Verificação de Permissões**
```python
if not request.user.is_staff:
    return Response({
        'success': False,
        'error': 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.'
    }, status=status.HTTP_403_FORBIDDEN)
```

### **Logs de Auditoria**
- Todas as ações são registradas com:
  - Quem fez a ação
  - Quando foi feita
  - Motivo da moderação
  - Status anterior e novo

## 📊 **Filtros de Conteúdo Público**

### **API Pública Atualizada**
A API pública (`/comunidade/`) agora filtra automaticamente:
- Apenas posts com `status='aprovado'`
- Apenas posts com `is_visivel=True`

```python
# Antes
postagens = Postagem.objects.order_by('-data_criacao')

# Agora
postagens = Postagem.objects.filter(status='aprovado', is_visivel=True).order_by('-data_criacao')
```

## 🎯 **Casos de Uso**

### **1. Moderação Manual**
```bash
# Listar posts pendentes
curl -H "Authorization: Bearer {token}" \
     "http://localhost:8000/comunidade/admin/?status=pendente"

# Aprovar post
curl -X PATCH \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"status": "aprovado", "motivo": "Conteúdo adequado"}' \
     "http://localhost:8000/comunidade/admin/postagens/1/"
```

### **2. Remoção de Spam**
```bash
# Rejeitar post
curl -X PATCH \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"status": "rejeitado", "motivo": "Conteúdo spam"}' \
     "http://localhost:8000/comunidade/admin/postagens/5/"
```

### **3. Exclusão Permanente**
```bash
# Deletar post permanentemente
curl -X DELETE \
     -H "Authorization: Bearer {token}" \
     "http://localhost:8000/comunidade/admin/postagens/5/"
```

## 🔄 **Fluxo de Moderação**

1. **Usuário cria post** → Status: `aprovado` (padrão)
2. **Admin revisa** → Pode alterar para `pendente`, `rejeitado` ou `removido`
3. **Post aprovado** → Fica visível na comunidade
4. **Post rejeitado/removido** → Não aparece na API pública
5. **Exclusão permanente** → Remove do banco de dados

## 📈 **Benefícios**

- ✅ **Controle total** sobre o conteúdo da comunidade
- ✅ **Auditoria completa** de todas as ações
- ✅ **Filtros avançados** para encontrar conteúdo específico
- ✅ **API RESTful** para integração com frontend
- ✅ **Segurança robusta** com verificação de permissões
- ✅ **Logs detalhados** para monitoramento

## 🚀 **Próximos Passos**

1. **Interface Web**: Criar dashboard de moderação
2. **Notificações**: Avisar usuários sobre moderação
3. **Auto-moderação**: Filtros automáticos por palavras-chave
4. **Relatórios**: Métricas de moderação por período
5. **Backup**: Sistema de backup antes de exclusões

