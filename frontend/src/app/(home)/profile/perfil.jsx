import { View, Text, TouchableOpacity} from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {

    const router = useRouter();

    const handleVeiculos = () => {
        router.push('/(home)/profile/veiculos');
      };

  return (
    <View>
      <Text>Página de perfil</Text>
        <Text>Gerencie suas informações pessoais</Text>
        <Text>Gerencie seus veículos</Text>
        <TouchableOpacity
              onPress={handleVeiculos}
            >
              <Text>Cadastrar veiculos</Text>
            </TouchableOpacity>
    </View>
  );
}
