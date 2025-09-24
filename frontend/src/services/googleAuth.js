import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { httpClient } from './clientConfig';
import { API_ENDPOINTS } from '../config/api';
import { GOOGLE_CONFIG } from '../config/googleConfig';

// Configuração do Google Sign-In
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_CONFIG.WEB_CLIENT_ID,
    iosClientId: GOOGLE_CONFIG.IOS_CLIENT_ID,
    offlineAccess: GOOGLE_CONFIG.OFFLINE_ACCESS,
    forceCodeForRefreshToken: GOOGLE_CONFIG.FORCE_CODE_FOR_REFRESH_TOKEN,
  });
};

// Função para fazer login com Google
export const signInWithGoogle = async () => {
  try {
    // Verificar se o dispositivo suporta Google Play Services (Android)
    await GoogleSignin.hasPlayServices();
    
    // Fazer sign-in com Google
    const userInfo = await GoogleSignin.signIn();
    
    console.log('🔍 Google Sign-In bem-sucedido:', userInfo);
    
    // Extrair informações do usuário
    const { user, idToken } = userInfo;
    
    // Enviar token para o backend para autenticação
    const response = await httpClient.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
      id_token: idToken,
      email: user.email,
      nome: user.name,
      foto: user.photo,
      google_id: user.id,
    });
    
    console.log('🔍 Resposta do backend:', response.data);
    
    return {
      success: true,
      data: response.data,
      userInfo: userInfo
    };
    
  } catch (error) {
    console.error('❌ Erro no Google Sign-In:', error);
    
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return {
        success: false,
        error: 'Login cancelado pelo usuário'
      };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return {
        success: false,
        error: 'Login já em progresso'
      };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        success: false,
        error: 'Google Play Services não disponível'
      };
    } else {
      return {
        success: false,
        error: 'Erro ao fazer login com Google'
      };
    }
  }
};

// Função para fazer logout do Google
export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    console.log('✅ Logout do Google realizado com sucesso');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao fazer logout do Google:', error);
    return { success: false, error: 'Erro ao fazer logout do Google' };
  }
};

// Função para verificar se o usuário está logado no Google
export const isSignedIn = async () => {
  try {
    const isSignedIn = await GoogleSignin.isSignedIn();
    return isSignedIn;
  } catch (error) {
    console.error('❌ Erro ao verificar status do Google Sign-In:', error);
    return false;
  }
};

// Função para obter informações do usuário atual do Google
export const getCurrentUser = async () => {
  try {
    const currentUser = await GoogleSignin.getCurrentUser();
    return currentUser;
  } catch (error) {
    console.error('❌ Erro ao obter usuário atual do Google:', error);
    return null;
  }
};
