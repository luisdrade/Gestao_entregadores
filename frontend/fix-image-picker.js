#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Verificando e corrigindo instalação do expo-image-picker...\n');

// Verificar se estamos no diretório correto
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json não encontrado. Execute este script no diretório frontend.');
  process.exit(1);
}

// Verificar se expo-image-picker está instalado
try {
  console.log('📦 Verificando instalação do expo-image-picker...');
  const result = execSync('npm list expo-image-picker', { encoding: 'utf8' });
  console.log('✅ expo-image-picker está instalado');
  console.log(result);
} catch (error) {
  console.log('❌ expo-image-picker não encontrado. Instalando...');
  
  try {
    execSync('npm install expo-image-picker@~16.1.4', { stdio: 'inherit' });
    console.log('✅ expo-image-picker instalado com sucesso');
  } catch (installError) {
    console.error('❌ Erro ao instalar expo-image-picker:', installError.message);
    process.exit(1);
  }
}

// Verificar versão do Expo
try {
  console.log('\n📱 Verificando versão do Expo...');
  const expoVersion = execSync('npx expo --version', { encoding: 'utf8' });
  console.log('✅ Versão do Expo:', expoVersion.trim());
} catch (error) {
  console.log('⚠️ Não foi possível verificar a versão do Expo');
}

// Verificar configurações do app.json
try {
  console.log('\n📄 Verificando app.json...');
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  
  let needsUpdate = false;
  
  // Verificar se o plugin do expo-image-picker está configurado
  if (!appJson.expo.plugins) {
    appJson.expo.plugins = [];
    needsUpdate = true;
  }
  
  const hasImagePickerPlugin = appJson.expo.plugins.some(plugin => 
    Array.isArray(plugin) && plugin[0] === 'expo-image-picker'
  );
  
  if (!hasImagePickerPlugin) {
    console.log('⚠️ Plugin expo-image-picker não encontrado no app.json');
    appJson.expo.plugins.push([
      'expo-image-picker',
      {
        'photosPermission': 'O app precisa acessar suas fotos para selecionar uma imagem de perfil.',
        'cameraPermission': 'O app precisa acessar sua câmera para tirar uma foto de perfil.'
      }
    ]);
    needsUpdate = true;
  }
  
  // Verificar permissões do Android
  if (!appJson.expo.android) {
    appJson.expo.android = {};
  }
  
  if (!appJson.expo.android.permissions) {
    appJson.expo.android.permissions = [];
  }
  
  const requiredPermissions = ['CAMERA', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE'];
  const missingPermissions = requiredPermissions.filter(perm => 
    !appJson.expo.android.permissions.includes(perm)
  );
  
  if (missingPermissions.length > 0) {
    console.log('⚠️ Permissões Android faltando:', missingPermissions);
    appJson.expo.android.permissions.push(...missingPermissions);
    needsUpdate = true;
  }
  
  // Verificar permissões do iOS
  if (!appJson.expo.ios) {
    appJson.expo.ios = {};
  }
  
  if (!appJson.expo.ios.infoPlist) {
    appJson.expo.ios.infoPlist = {};
  }
  
  const requiredInfoPlist = {
    'NSCameraUsageDescription': 'O app precisa acessar sua câmera para tirar uma foto de perfil.',
    'NSPhotoLibraryUsageDescription': 'O app precisa acessar suas fotos para selecionar uma imagem de perfil.'
  };
  
  Object.entries(requiredInfoPlist).forEach(([key, value]) => {
    if (!appJson.expo.ios.infoPlist[key]) {
      console.log(`⚠️ InfoPlist iOS faltando: ${key}`);
      appJson.expo.ios.infoPlist[key] = value;
      needsUpdate = true;
    }
  });
  
  if (needsUpdate) {
    fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));
    console.log('✅ app.json atualizado com as configurações necessárias');
  } else {
    console.log('✅ app.json já está configurado corretamente');
  }
  
} catch (error) {
  console.error('❌ Erro ao verificar app.json:', error.message);
}

// Limpar cache
try {
  console.log('\n🧹 Limpando cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ Cache limpo');
} catch (error) {
  console.log('⚠️ Erro ao limpar cache:', error.message);
}

// Verificar se node_modules existe
if (!fs.existsSync('node_modules')) {
  console.log('\n📦 node_modules não encontrado. Instalando dependências...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependências instaladas');
  } catch (error) {
    console.error('❌ Erro ao instalar dependências:', error.message);
  }
}

console.log('\n🎯 Próximos passos:');
console.log('1. Execute: npx expo start --clear');
console.log('2. Se o problema persistir, execute: npx expo run:android');
console.log('3. Para iOS: npx expo run:ios');
console.log('\n✅ Verificação concluída!');
