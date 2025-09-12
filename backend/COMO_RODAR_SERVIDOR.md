# Como Rodar o Servidor Django

## Problema
Por padrão, o Django roda em `127.0.0.1:8000`, mas para acessar de outros dispositivos na rede, é necessário usar `0.0.0.0:8000`.

## Soluções Implementadas

### 1. ✅ MODIFICAÇÃO AUTOMÁTICA DO MANAGE.PY (RECOMENDADO)
```bash
python manage.py runserver
```
**Agora funciona automaticamente!** O `manage.py` foi modificado para usar `0.0.0.0:8000` automaticamente quando você roda apenas `runserver`.

### 2. Script PowerShell (Windows)
```powershell
.\start_server.ps1
```
Script PowerShell que ativa o ambiente virtual e inicia o servidor.

### 3. Script Python Personalizado
```bash
python runserver.py
```
Este script automaticamente configura o servidor para rodar em `0.0.0.0:8000`.

### 4. Arquivo Batch para Windows
```bash
start_server.bat
```
Clique duas vezes no arquivo ou execute no terminal.

### 5. Comando Manual (Como você fazia antes)
```bash
python manage.py runserver 0.0.0.0:8000
```

## ✅ SOLUÇÃO PRINCIPAL
**Agora você pode simplesmente usar:**
```bash
python manage.py runserver
```
E o servidor automaticamente rodará em `0.0.0.0:8000`!

## Acesso
Após iniciar o servidor, você pode acessar:
- Local: `http://localhost:8000`
- Rede local: `http://SEU_IP_LOCAL:8000`
- Mobile/outros dispositivos: `http://IP_DO_COMPUTADOR:8000`

## Como Descobrir Seu IP Local
- Windows: `ipconfig`
- Procure por "Adaptador Ethernet" ou "Adaptador Wi-Fi"
- Use o endereço IPv4 (ex: 192.168.1.100)
