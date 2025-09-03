// Configura��o do Google Sign-In
// 
// INSTRU��ES PARA CONFIGURAR:
// 
// 1. Acesse: https://console.cloud.google.com/
// 2. Crie um novo projeto ou selecione um existente
// 3. Ative a API "Google Sign-In API"
// 4. V� em "Credenciais" e crie credenciais OAuth 2.0
// 5. Configure as URLs autorizadas:
//    - Para Android: adicione o SHA-1 do seu projeto
//    - Para iOS: adicione o Bundle ID
//    - Para Web: adicione o dom�nio do seu backend
//
// 6. Substitua os valores abaixo pelos seus IDs reais:

export const GOOGLE_CONFIG = {
  // Web Client ID (obrigat�rio para Android)
  WEB_CLIENT_ID: '424994830272-fj72bna9gfo6scp8fsecmf2sp8aahvqg.apps.googleusercontent.com',
  
  // iOS Client ID (opcional, apenas para iOS)
  IOS_CLIENT_ID: '424994830272-89dp1i7t49sq2l31okuu3uiiketfk053.apps.googleusercontent.com',
  
  // Configura��es adicionais
  OFFLINE_ACCESS: true,
  FORCE_CODE_FOR_REFRESH_TOKEN: true,
};
