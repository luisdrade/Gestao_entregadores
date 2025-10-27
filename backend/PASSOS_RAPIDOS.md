# ⚡ Passos Rápidos - Configurar Banco no Render (EntregasPlus)

## 🎯 O que fazer AGORA:

### 1. Render Dashboard → Web Service → Environment

### 2. Adicionar/Editar `DATABASE_URL` com este valor:

```
postgresql://user_entregas:C2OjukKx5anKGsMOICoYWxsrun3kDClQ@dpg-d3rsehk9c44c73avmah0-a/entregas_plus
```

### 3. Aguarde deploy (~5 min)

### 4. Shell → Execute:
```bash
python manage.py migrate
```

### 5. Teste no app! 🎉

