# 🛠️ Scripts Utilitários

Esta pasta contém scripts utilitários para facilitar o desenvolvimento e manutenção do projeto.

## 📄 Scripts Disponíveis

### `sync-env.js`
Sincroniza a variável `API_BASE_URL` do arquivo `.env` da raiz para os arquivos `.env` dos frontends (mobile e web).

**Uso:**
```bash
node scripts/sync-env.js
```

**O que faz:**
- Lê `API_BASE_URL` do `.env` na raiz do projeto
- Cria/atualiza `frontend/.env` com `EXPO_PUBLIC_API_BASE_URL`
- Cria/atualiza `frontend-web/.env` com `VITE_API_BASE_URL`

**Requisitos:**
- Node.js instalado
- Arquivo `.env` na raiz com `API_BASE_URL` configurada

---

## 💡 Dicas

- Execute `sync-env.js` sempre que alterar a URL da API na raiz
- Os arquivos `.env` gerados são ignorados pelo Git (`.gitignore`)
- Reinicie os servidores de desenvolvimento após sincronizar

---

**Nota**: Scripts específicos de cada módulo (frontend, frontend-web, backend) estão em suas respectivas pastas.

