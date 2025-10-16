# 📱 Build APK - App Expo

Este guia explica como gerar um APK do seu app Expo para instalação em dispositivos Android.

## 🎯 Visão Geral

O projeto está configurado para usar **Expo Application Services (EAS)** para builds na nuvem. Isso significa que você não precisa configurar Android Studio ou SDK localmente.

## 📋 Pré-requisitos

### Obrigatórios
- ✅ **Node.js** (versão 18 ou superior)
- ✅ **Conta Expo** (gratuita)
- ✅ **EAS CLI** (instalado automaticamente pelos scripts)

### Opcionais
- Git (para controle de versão)
- Editor de código (VS Code recomendado)

## 🚀 Métodos de Build

### Método 1: Script Automatizado (Recomendado)

#### Windows (PowerShell)
```powershell
cd frontend
.\build-apk.ps1
```

#### Linux/Mac (Bash)
```bash
cd frontend
./build-apk.sh
```

### Método 2: Comando Manual

```bash
cd frontend
npx eas-cli@latest build --platform android --profile preview
```

## 📖 Instruções Detalhadas

### 1. Preparação

1. **Navegue para o diretório frontend:**
   ```bash
   cd frontend
   ```

2. **Verifique se as dependências estão instaladas:**
   ```bash
   npm install
   ```

### 2. Login no EAS (primeira vez)

Se for sua primeira vez usando EAS:

```bash
npx eas-cli@latest login
```

Isso abrirá o navegador para você fazer login com sua conta Expo.

### 3. Executar Build

#### Opção A: Script Automatizado
```powershell
# Windows
.\build-apk.ps1
```

```bash
# Linux/Mac
./build-apk.sh
```

#### Opção B: Comando Manual
```bash
npx eas-cli@latest build --platform android --profile preview
```

### 4. Aguardar Build

- ⏱️ **Tempo estimado:** 5-15 minutos
- 🌐 **Onde acontece:** Na nuvem do Expo
- 📊 **Progresso:** Visível no terminal

### 5. Download do APK

Após o build, você receberá:
- 🔗 **Link de download** no terminal
- 📧 **Email** com o link (se configurado)
- 🌐 **Dashboard** do Expo com todos os builds

### 6. Instalação no Android

1. **Baixe o APK** no seu dispositivo Android
2. **Habilite fontes desconhecidas:**
   - Vá em **Configurações > Segurança**
   - Ative **"Fontes desconhecidas"** ou **"Instalar apps desconhecidos"**
3. **Instale o APK:**
   - Toque no arquivo baixado
   - Confirme a instalação

## ⚙️ Configurações do Projeto

### Perfis de Build Disponíveis

| Perfil | Descrição | Uso |
|--------|-----------|-----|
| `preview` | Build de teste/desenvolvimento | **Recomendado para testes** |
| `development` | Build com dev client | Para desenvolvimento ativo |
| `production` | Build de produção | Para lançamento |

### Configuração Android

O app está configurado com:
- **Package:** `com.luisdrade.gestaoentregadores`
- **Versão:** 1.0.0
- **Permissões:** Internet, Câmera, Armazenamento

## 🔧 Troubleshooting

### Erro: "EAS CLI não encontrado"
```bash
npm install -g @expo/eas-cli
```

### Erro: "Não está logado"
```bash
npx eas-cli@latest login
```

### Erro: "Projeto não encontrado"
- Verifique se está no diretório `frontend`
- Verifique se `app.json` existe
- Execute: `npx eas-cli@latest init`

### Erro: "Build falhou"
1. **Verifique a conexão com internet**
2. **Verifique se todas as dependências estão instaladas:**
   ```bash
   npm install
   ```
3. **Limpe o cache:**
   ```bash
   npx expo install --fix
   ```
4. **Verifique os logs** no terminal para mais detalhes

### APK não instala no Android
1. **Habilite fontes desconhecidas** nas configurações
2. **Verifique se há espaço suficiente** no dispositivo
3. **Tente baixar novamente** o APK
4. **Verifique se o dispositivo é compatível** (Android 5.0+)

### Build muito lento
- **Use cache:** Já habilitado por padrão
- **Evite builds desnecessários:** Só faça build quando necessário
- **Use perfil correto:** `preview` para testes, `production` para lançamento

## 📚 Comandos Úteis

### Verificar status do build
```bash
npx eas-cli@latest build:list
```

### Cancelar build em andamento
```bash
npx eas-cli@latest build:cancel [BUILD_ID]
```

### Ver informações do projeto
```bash
npx eas-cli@latest project:info
```

### Ver builds recentes
```bash
npx eas-cli@latest build:list --limit 5
```

## 🚀 Preparação para Produção

### Quando estiver pronto para lançar:

1. **Configure keystore para assinatura:**
   ```bash
   npx eas-cli@latest credentials
   ```

2. **Use perfil production:**
   ```bash
   npx eas-cli@latest build --platform android --profile production
   ```

3. **Para Play Store, use AAB:**
   ```json
   // eas.json
   "production": {
     "android": {
       "buildType": "aab"
     }
   }
   ```

## 📞 Suporte

- 📖 **Documentação Expo:** https://docs.expo.dev/
- 🆘 **Suporte EAS:** https://expo.dev/support
- 💬 **Comunidade:** https://forums.expo.dev/

## 📝 Notas Importantes

- ⏰ **APKs expiram em 30 dias** no Expo
- 🔄 **Faça builds regulares** para manter versões atualizadas
- 💾 **Mantenha backups** dos APKs importantes
- 🧪 **Teste sempre** antes de distribuir

---

**Última atualização:** $(date)
**Versão do guia:** 1.0

