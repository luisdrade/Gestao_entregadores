# 🔄 Migração MySQL → PostgreSQL

## Por que migrar?
- ✅ **Render.com** oferece PostgreSQL gratuito
- ✅ **PostgreSQL** é mais robusto que MySQL
- ✅ **Compatibilidade** total com Django
- ✅ **Performance** melhor

## 📋 Passo a Passo da Migração

### 1. **Backup dos dados MySQL (se necessário)**
```bash
# Se você tem dados importantes no MySQL local
mysqldump -u root -p Banco_EntregasPlus > backup_mysql.sql
```

### 2. **Configurações já atualizadas**
✅ `settings.py` - Configurado para PostgreSQL  
✅ `requirements.txt` - psycopg2-binary adicionado  
✅ `env.example` - Variáveis para PostgreSQL  

### 3. **Instalar dependências PostgreSQL localmente**
```bash
# Ativar ambiente virtual
.\venv\Scripts\Activate.ps1

# Instalar psycopg2
pip install psycopg2-binary

# Atualizar requirements
pip freeze > requirements.txt
```

### 4. **Testar localmente com PostgreSQL**
```bash
# Instalar PostgreSQL local (opcional)
# Ou usar Docker:
docker run --name postgres-test -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres

# Configurar .env local
DATABASE_URL=postgresql://postgres:123456@localhost:5432/gestao_entregadores

# Executar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Testar aplicação
python manage.py runserver
```

### 5. **Deploy no Render.com**
- O Render.com configurará automaticamente o PostgreSQL
- As migrações serão executadas automaticamente
- Não precisa fazer nada manualmente

## 🔧 **Diferenças MySQL vs PostgreSQL**

### **Sintaxe SQL:**
- **MySQL**: `AUTO_INCREMENT`
- **PostgreSQL**: `SERIAL` ou `IDENTITY`

### **Tipos de dados:**
- **MySQL**: `TINYINT`, `MEDIUMTEXT`
- **PostgreSQL**: `SMALLINT`, `TEXT`

### **Django ORM:**
- **Funciona igual** em ambos
- **Sem mudanças** necessárias no código

## ✅ **Vantagens da Migração**

1. **Gratuito** no Render.com
2. **Melhor performance**
3. **Mais recursos** (JSON, Arrays, etc.)
4. **Padrão** da indústria
5. **Compatibilidade** total com Django

## 🚀 **Próximos Passos**

1. **Fazer commit** das mudanças
2. **Deploy no Render.com**
3. **Testar** a aplicação
4. **Configurar** variáveis de ambiente

## 📞 **Suporte**

Se tiver problemas:
1. Verifique os logs do Render.com
2. Teste localmente primeiro
3. Verifique as variáveis de ambiente

