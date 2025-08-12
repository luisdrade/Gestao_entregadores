import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';

export default function EntregasScreen() {
  const router = useRouter();

  const [tipoRendimento, setTipoRendimento] = React.useState(null);
  const [categoriaDespesa, setCategoriaDespesa] = React.useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Entregas</Text>
        <View style={{ width: 60 }} />
        
      </View>

      <View style={styles.content}>
        <View style={styles.form}>

          <View>
            <Text style={styles.label}>Tipo Rendimento</Text>
            <RNPickerSelect
              onValueChange={(value) => setTipoRendimento(value)}
              placeholder={{ label: 'Selecione o Tipo de Rendimento', value: null }}

              items={[
                { label: 'Valor por Diária', value: 'diaria' },
                { label: 'Valor únitario por Pacote', value: 'pacote' },
              ]}

              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input
              }}

            />
          </View>

          <View>
            <Text style={styles.label}>Total Pacote</Text>
            <TextInput style={styles.input}></TextInput>
          </View>

          <View>
            <Text style={styles.label}>Pacotes Entregues</Text>
            <TextInput style={styles.input}></TextInput>
          </View>

          <View>
            <Text style={styles.label}>Pacotes não entregues</Text>
            <TextInput style={styles.input}></TextInput>
          </View>

          <View>
            <Text style={styles.label}>Pacotes não entregues</Text>
            <TextInput style={styles.input}></TextInput>
          </View>

          <View>
            <Text style={styles.label}>Valor despesa</Text>
            <TextInput style={styles.input}></TextInput>
          </View>

          <View>
            <Text style={styles.label}>Categoria despesa</Text>
            <RNPickerSelect
              onValueChange={(value) => setCategoriaDespesa(value)}
              placeholder={{ label: 'Selecione a Despesa', value: null }}

              items={[
                { label: 'Valor por Diária', value: 'diaria' },
                { label: 'Valor únitario por Pacote', value: 'pacote' },
              ]}

              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input
              }}              
            />
          </View>

          <View>
            <Text style={styles.label}>Dia do Registro </Text>
            <TextInput style={styles.input}></TextInput>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16
  },
  picker: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 16,
  },
});
