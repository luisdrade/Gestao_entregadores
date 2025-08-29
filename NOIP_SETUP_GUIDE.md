# 🚀 Guia Completo: Configuração NO-IP para Gestão de Entregadores

## 📋 Visão Geral

Este guia te ajudará a configurar o NO-IP para resolver o problema do IP dinâmico, permitindo que seu frontend se conecte ao backend sem precisar alterar o IP manualmente.

## 🎯 Problema Resolvido

- ❌ **Antes**: IP muda constantemente, precisa atualizar configuração manualmente
- ✅ **Depois**: Domínio fixo que sempre aponta para o IP correto

## 📝 Passo a Passo

### 1. Criar Conta NO-IP

1. Acesse [noip.com](https://www.noip.com)
2. Clique em "Sign Up" e crie uma conta gratuita
3. Escolha um nome de domínio (ex: `entregasplus.ddns.net`)
4. Confirme seu email

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` no diretório `backend/` com:

```bash
# Configurações do NO-IP
NOIP_USERNAME=seu_usuario_noip
NOIP_PASSWORD=sua_senha_noip
NOIP_HOSTNAME=entregasplus.ddns.net

# Configurações do Django
DEBUG=True
SECRET_KEY=sua_chave_secreta_aqui
ALLOWED_HOSTS=localhost,127.0.0.1,entregasplus.ddns.net
```

### 3. Instalar Dependências

```bash
cd backend
pip install -r requirements.txt
```

### 4. Testar Configuração NO-IP

```bash
cd backend
python setup_noip.py
```

### 5. Iniciar Servidor com NO-IP

```bash
cd backend
python start_server_with_noip.py
```

## 🔧 Configuração do Frontend

### Atualizar API Config

No arquivo `frontend/src/config/api.js`, certifique-se de que está assim:

```javascript
export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://10.250.135.36:8000' : 'http://entregasplus.ddns.net:8000',
  TIMEOUT: 15000,
};
```

**Substitua `entregasplus.ddns.net` pelo seu domínio NO-IP!**

## 🚀 Inicialização Automática

### Windows (Task Scheduler)

1. Abra o "Agendador de Tarefas"
2. Crie uma nova tarefa
3. Configure para executar na inicialização:
   ```cmd
   cd C:\caminho\para\seu\projeto\backend
   python start_server_with_noip.py
   ```

### Linux (systemd)

Crie um arquivo `/etc/systemd/system/entregasplus.service`:

```ini
[Unit]
Description=Gestao Entregadores com NO-IP
After=network.target

[Service]
Type=simple
User=seu_usuario
WorkingDirectory=/caminho/para/seu/projeto/backend
Environment=NOIP_USERNAME=seu_usuario
Environment=NOIP_PASSWORD=sua_senha
Environment=NOIP_HOSTNAME=entregasplus.ddns.net
ExecStart=/usr/bin/python3 start_server_with_noip.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Ative o serviço:
```bash
sudo systemctl enable entregasplus
sudo systemctl start entregasplus
```

## 🔍 Verificação

### Testar Conexão

1. **Backend**: Acesse `http://entregasplus.ddns.net:8000/admin/`
2. **Frontend**: Teste o login no app
3. **Logs**: Verifique se o NO-IP está atualizando

### Comandos Úteis

```bash
# Verificar se o domínio está funcionando
nslookup entregasplus.ddns.net

# Testar conectividade
curl http://entregasplus.ddns.net:8000/

# Ver logs do NO-IP
tail -f noip.log
```

## 🛠️ Solução de Problemas

### Erro: "Hostname not found"

1. Verifique se o domínio está correto
2. Aguarde alguns minutos para propagação
3. Teste: `ping entregasplus.ddns.net`

### Erro: "Authentication failed"

1. Verifique usuário e senha NO-IP
2. Confirme se a conta está ativa
3. Teste no site do NO-IP

### Erro: "Connection refused"

1. Verifique se o servidor Django está rodando
2. Confirme se a porta 8000 está aberta
3. Teste: `netstat -an | grep 8000`

## 📱 Configuração para Produção

### Firewall

Abra a porta 8000:
```bash
# Windows
netsh advfirewall firewall add rule name="Django" dir=in action=allow protocol=TCP localport=8000

# Linux
sudo ufw allow 8000
```

### Proxy Reverso (Opcional)

Para usar HTTPS, configure nginx:

```nginx
server {
    listen 80;
    server_name entregasplus.ddns.net;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🎉 Resultado Final

Após a configuração:

- ✅ Frontend sempre conecta ao backend correto
- ✅ Não precisa mais alterar IP manualmente
- ✅ Funciona em qualquer rede
- ✅ Atualização automática do IP

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do script NO-IP
2. Teste a conectividade manualmente
3. Confirme as configurações do firewall
4. Verifique se o domínio NO-IP está ativo

---

**🎯 Agora seu app funcionará perfeitamente sem precisar alterar o IP manualmente!**
