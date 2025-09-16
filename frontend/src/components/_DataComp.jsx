import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';

export default function DatePicker({ 
  value, 
  onDateChange, 
  placeholder = "25/12/2024",
  label = "Data",
  error = false,
  errorMessage = "",
  style = {}
}) {
  const getDaysInMonth = (month, year) => {
    // Meses com 31 dias: 1, 3, 5, 7, 8, 10, 12
    const monthsWith31Days = [1, 3, 5, 7, 8, 10, 12];
    // Meses com 30 dias: 4, 6, 9, 11
    const monthsWith30Days = [4, 6, 9, 11];
    
    if (monthsWith31Days.includes(month)) {
      return 31;
    } else if (monthsWith30Days.includes(month)) {
      return 30;
    } else if (month === 2) {
      // Fevereiro: verificar se é ano bissexto
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 29 : 28;
    }
    return 30; // fallback
  };

  const formatDate = (inputValue) => {
    // Remove tudo que não é número
    const numericValue = inputValue.replace(/\D/g, '');
    
    if (numericValue.length === 0) {
      return '';
    } else if (numericValue.length <= 2) {
      // Validar dia (1-31)
      const dia = parseInt(numericValue);
      if (dia > 31) {
        return '31';
      }
      return numericValue;
    } else if (numericValue.length <= 4) {
      const dia = numericValue.slice(0, 2);
      const mes = numericValue.slice(2, 4);
      
      // Validar dia
      const diaInt = parseInt(dia);
      let diaValido = dia;
      if (diaInt > 31) {
        diaValido = '31';
      }
      
      // Validar mês (1-12)
      const mesInt = parseInt(mes);
      let mesValido = mes;
      if (mesInt > 12) {
        mesValido = '12';
      }
      
      return `${diaValido}/${mesValido}`;
    } else {
      const dia = numericValue.slice(0, 2);
      const mes = numericValue.slice(2, 4);
      const ano = numericValue.slice(4, 8);
      
      // Validar mês (1-12)
      const mesInt = parseInt(mes);
      let mesValido = mes;
      if (mesInt > 12) {
        mesValido = '12';
      }
      
      // Validar ano (até 2100 para permitir datas futuras válidas)
      const anoInt = parseInt(ano);
      let anoValido = ano;
      if (anoInt > 2100) {
        anoValido = '2100';
      }
      
      // Validar dia baseado no mês e ano
      const diaInt = parseInt(dia);
      const maxDays = getDaysInMonth(mesInt, anoInt);
      let diaValido = dia;
      if (diaInt > maxDays) {
        diaValido = maxDays.toString().padStart(2, '0');
      }
      
      return `${diaValido}/${mesValido}/${anoValido}`;
    }
  };

  const handleDateChange = (inputValue) => {
    const formatted = formatDate(inputValue);
    onDateChange(formatted);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        value={value}
        onChangeText={handleDateChange}
        keyboardType="numeric"
        placeholderTextColor="#666"
        maxLength={10}
      />
      
      {error && errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  label: {
    fontSize: 14,
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
