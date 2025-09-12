import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';

export default function TimePicker({ 
  value, 
  onTimeChange, 
  placeholder = "08:00",
  label = "Horário",
  error = false,
  errorMessage = "",
  style = {}
}) {
  const formatTime = (inputValue) => {
    // Remove tudo que não é número
    const numericValue = inputValue.replace(/\D/g, '');
    
    if (numericValue.length === 0) {
      return '';
    } else if (numericValue.length === 1) {
      return numericValue;
    } else if (numericValue.length === 2) {
      const hora = parseInt(numericValue);
      if (hora > 23) {
        return '23';
      }
      return numericValue;
    } else if (numericValue.length === 3) {
      // Caso especial: 3 dígitos (ex: 256 -> 23:59)
      const hora = numericValue.slice(0, 2);
      const minuto = numericValue.slice(2, 3);
      
      const horaInt = parseInt(hora);
      if (horaInt > 23) {
        return '23:59';
      }
      
      return `${hora}:${minuto}`;
    } else {
      // 4 ou mais dígitos
      const hora = numericValue.slice(0, 2);
      const minuto = numericValue.slice(2, 4);
      
      // Validar hora (0-23)
      const horaInt = parseInt(hora);
      let horaValida = hora;
      if (horaInt > 23) {
        horaValida = '23';
      }
      
      // Validar minuto (0-59)
      const minutoInt = parseInt(minuto);
      let minutoValido = minuto;
      if (minutoInt > 59) {
        minutoValido = '59';
      }
      
      return `${horaValida}:${minutoValido}`;
    }
  };

  const handleTimeChange = (inputValue) => {
    const formatted = formatTime(inputValue);
    onTimeChange(formatted);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        value={value}
        onChangeText={handleTimeChange}
        keyboardType="numeric"
        placeholderTextColor="#666"
        maxLength={5}
      />
      
      {error && errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
  },
});
