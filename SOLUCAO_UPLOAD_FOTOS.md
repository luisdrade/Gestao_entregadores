# 🔧 Guia de Solução de Problemas - Upload de Fotos

## 📋 **Problemas Identificados e Soluções**

### **1. Problema: ImagePicker não disponível**
**Sintomas:**
- Erro ao importar `expo-image-picker`
- App trava ao tentar selecionar foto

**Solução:**
✅ **IMPLEMENTADA** - Importação direta do ImagePicker
```javascript
import * as ImagePicker from 'expo-image-picker';
```

### **2. Problema: Permissões não solicitadas corretamente**
**Sintomas:**
- App não consegue acessar câmera/galeria
- Erro de permissão negada

**Solução:**
✅ **IMPLEMENTADA** - Função dedicada para solicitar permissões
```javascript
const requestPermissions = async () => {
  const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
  const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
    Alert.alert('Permissões necessárias', 'Conceda permissões nas configurações');
    return false;
  }
  return true;
};
```

### **3. Problema: Formato base64 incorreto**
**Sintomas:**
- Erro "Formato de imagem inválido" no backend
- Upload falha

**Solução:**
✅ **IMPLEMENTADA** - Formato correto do base64
```javascript
const fotoData = `data:image/jpeg;base64,${base64Image}`;
```

### **4. Problema: URL da foto incorreta**
**Sintomas:**
- Foto não aparece após upload
- Erro 404 ao carregar imagem

**Solução:**
✅ **IMPLEMENTADA** - Construção correta da URL
```javascript
const buildPhotoUrl = () => {
  const baseUrl = API_CONFIG.BASE_URL;
  if (user?.foto) {
    if (user.foto.startsWith('http')) {
      setPhotoUrl(user.foto);
    } else {
      const fullUrl = `${baseUrl}${user.foto}`;
      setPhotoUrl(fullUrl);
    }
  }
};
```

### **5. Problema: Backend não serve arquivos de mídia**
**Sintomas:**
- Fotos não carregam no frontend
- Erro 404 para URLs de mídia

**Solução:**
✅ **IMPLEMENTADA** - Configuração correta no Django
```python
# settings.py
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# urls.py
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## 🧪 **Testes Realizados**

### **Backend Testado:**
```bash
python test_upload_foto.py
```

**Resultado:**
- ✅ Diretório MEDIA_ROOT existe
- ✅ Upload de foto funcionando
- ✅ Arquivo salvo corretamente
- ✅ URL acessível

## 🔍 **Como Diagnosticar Problemas**

### **1. Verificar Logs do Frontend**
```javascript
console.log('📸 Imagem selecionada:', image.uri);
console.log('📸 Base64 disponível:', !!image.base64);
console.log('🔍 Tamanho do base64:', base64Image.length);
```

### **2. Verificar Logs do Backend**
```python
print(f"📸 UploadFotoPerfilView - Usuário: {user.email}")
print(f"📸 UploadFotoPerfilView - Dados recebidos: {len(str(foto_data))} caracteres")
print(f"📸 UploadFotoPerfilView - Base64 limpo: {len(foto_data)} caracteres")
```

### **3. Verificar Configurações**
- ✅ `expo-image-picker` instalado
- ✅ Permissões configuradas no `app.json`
- ✅ Backend servindo arquivos de mídia
- ✅ URLs construídas corretamente

## 🚀 **Melhorias Implementadas**

### **Frontend:**
1. **Importação direta do ImagePicker**
2. **Solicitação de permissões melhorada**
3. **Tratamento de erros robusto**
4. **Construção correta de URLs**
5. **Feedback visual durante upload**

### **Backend:**
1. **Logging detalhado**
2. **Tratamento de erros específicos**
3. **Configurações de mídia otimizadas**
4. **Validação de formato de imagem**

## 📱 **Configurações Necessárias**

### **app.json (Expo)**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "O app precisa acessar suas fotos para selecionar uma imagem de perfil.",
          "cameraPermission": "O app precisa acessar sua câmera para tirar uma foto de perfil."
        }
      ]
    ]
  }
}
```

### **package.json**
```json
{
  "dependencies": {
    "expo-image-picker": "~16.1.4"
  }
}
```

## 🔧 **Comandos de Debug**

### **Testar Backend:**
```bash
cd backend
python test_upload_foto.py
```

### **Verificar Logs:**
```bash
# Frontend (console do React Native)
# Backend (terminal onde o Django está rodando)
```

### **Verificar Arquivos:**
```bash
# Verificar se o diretório de mídia existe
ls backend/media/fotos_perfil/
```

## ✅ **Status Atual**

- ✅ **ImagePicker funcionando**
- ✅ **Permissões configuradas**
- ✅ **Upload de fotos funcionando**
- ✅ **Backend servindo arquivos**
- ✅ **URLs construídas corretamente**
- ✅ **Tratamento de erros implementado**

## 🆘 **Se Ainda Houver Problemas**

1. **Verificar logs do console**
2. **Testar com imagem menor**
3. **Verificar conectividade de rede**
4. **Reiniciar servidor Django**
5. **Limpar cache do app**

---

**Última atualização:** $(date)
**Versão:** 1.0
**Status:** ✅ Funcionando
