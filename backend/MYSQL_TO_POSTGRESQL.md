# 🔄 Migração MySQL → PostgreSQL

## ✅ **Por que é Simples?**
- Django ORM abstrai as diferenças
- Migrações funcionam automaticamente
- Código não precisa mudar
- Apenas configuração de ambiente

## 🛠️ **Passo a Passo**

### 1️⃣ **Verificar Dependências**
Seu `requirements.txt` já tem:
```bash
psycopg2-binary==2.9.10  # ✅ PostgreSQL
mysqlclient==2.2.7      # ✅ MySQL (pode manter)
```

### 2️⃣ **Configurar Variáveis de Ambiente**

#### Para PostgreSQL (Render.com):
```env
# Remover variáveis MySQL
# DB_ENGINE=django.db.backends.mysql
# DB_NAME=gestao_entregadores
# DB_USER=root
# DB_PASSWORD=
# DB_HOST=localhost
# DB_PORT=3306

# Usar DATABASE_URL (PostgreSQL)
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
```

#### Para MySQL (se quiser manter):
```env
DB_ENGINE=django.db.backends.mysql
DB_NAME=gestao_entregadores
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
```

### 3️⃣ **Django Detecta Automaticamente**
O Django já está configurado para usar `DATABASE_URL` quando disponível:

```python
# settings.py (já configurado)
if os.getenv('DATABASE_URL'):
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.parse(os.getenv('DATABASE_URL'))
    }
```

### 4️⃣ **Executar Migrações**
```bash
# Django cria automaticamente as tabelas no PostgreSQL
python manage.py migrate

# Se houver conflitos, resetar migrações
python manage.py migrate --run-syncdb
```

### 5️⃣ **Migrar Dados (Opcional)**
```bash
# 1. Exportar do MySQL
python manage.py dumpdata --natural-foreign --natural-primary > data.json

# 2. Configurar PostgreSQL
# 3. Importar dados
python manage.py loaddata data.json
```

## 🎯 **Vantagens do PostgreSQL**
- ✅ **Melhor performance** para consultas complexas
- ✅ **Tipos de dados** mais ricos
- ✅ **JSON nativo** (útil para APIs)
- ✅ **Full-text search** integrado
- ✅ **Melhor suporte** em nuvem

## ⚠️ **Possíveis Diferenças**

### 1. **Tipos de Dados**
```python
# MySQL
models.CharField(max_length=255)

# PostgreSQL (mesmo código!)
models.CharField(max_length=255)
```

### 2. **Consultas SQL**
```python
# Django ORM (funciona igual)
Entregador.objects.filter(nome__icontains='João')
```

### 3. **Índices**
```python
# Django cria automaticamente
class Meta:
    indexes = [
        models.Index(fields=['nome']),
    ]
```

## 🚀 **Deploy no Render.com**

### Configuração Automática:
```yaml
# render.yaml (já criado)
databases:
  - name: gestao-entregadores-db
    plan: free
    databaseName: gestao_entregadores
    user: gestao_user
```

### Variáveis de Ambiente:
```env
DATABASE_URL=postgresql://gestao_user:senha@host:porta/gestao_entregadores
```

## 🔍 **Verificar se Funcionou**

### 1. **Testar Conexão**
```bash
python manage.py dbshell
```

### 2. **Verificar Tabelas**
```sql
-- PostgreSQL
\dt

-- MySQL (para comparação)
SHOW TABLES;
```

### 3. **Testar API**
```bash
curl https://seu-backend.onrender.com/api/
```

## 📊 **Comparação**

| Aspecto | MySQL | PostgreSQL |
|---------|-------|------------|
| **Performance** | Bom | Excelente |
| **Tipos de Dados** | Básicos | Avançados |
| **JSON** | Limitado | Nativo |
| **Full-text Search** | Básico | Avançado |
| **Nuvem** | Limitado | Excelente |
| **Django** | ✅ | ✅ |

## 🎉 **Conclusão**
- ✅ **Mudança é transparente** para o Django
- ✅ **Apenas configuração** de ambiente
- ✅ **Migrações automáticas**
- ✅ **Código não muda**
- ✅ **Melhor performance** no PostgreSQL

## 🚀 **Próximo Passo**
1. Configure `DATABASE_URL` no Render.com
2. Execute `python manage.py migrate`
3. Teste a API
4. Pronto! 🎉
