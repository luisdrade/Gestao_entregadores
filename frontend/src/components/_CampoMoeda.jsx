import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

const _CampoMoeda = ({
  label,
  value,
  onChangeText,
  placeholder = '0,00',
  error = false,
  errorMessage = '',
  style = {},
  currency = 'BRL',
  prefix = 'R$',
  suffix = '',
  maxValue,
  minValue = 0,
}) => {
  const formatCurrency = (inputValue) => {
    // Remove tudo que não é número
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    
    if (numericValue === '') return '';

    // Converte para centavos e formata
    const floatValue = parseFloat(numericValue) / 100;
    
    // Aplicar limites se definidos
    let finalValue = floatValue;
    if (maxValue !== undefined && floatValue > maxValue) {
      finalValue = maxValue;
    }
    if (minValue !== undefined && floatValue < minValue) {
      finalValue = minValue;
    }

    return finalValue.toFixed(2);
  };

  const handleTextChange = (inputValue) => {
    const formatted = formatCurrency(inputValue);
    if (onChangeText) {
      onChangeText(formatted);
    }
  };

  const getDisplayValue = () => {
    if (!value) return '';
    return value;
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {prefix && (
          <Text style={styles.prefix}>{prefix}</Text>
        )}
        
        <TextInput
          style={styles.input}
          value={getDisplayValue()}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#666"
          keyboardType="numeric"
          maxLength={10}
        />
        
        {suffix && (
          <Text style={styles.suffix}>{suffix}</Text>
        )}
      </View>
      
      {error && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 0,
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
  prefix: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
    fontWeight: '500',
  },
  suffix: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default _CampoMoeda;
