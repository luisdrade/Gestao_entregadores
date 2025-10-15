import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const CodeInput = ({ 
  value = '', 
  onChange, 
  error = null, 
  length = 6, 
  disabled = false,
  autoFocus = true 
}) => {
  const [digits, setDigits] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Atualizar digits quando value externo muda
    if (value && value.length <= length) {
      const newDigits = Array(length).fill('');
      for (let i = 0; i < value.length; i++) {
        newDigits[i] = value[i];
      }
      setDigits(newDigits);
    }
  }, [value, length]);

  const handleDigitChange = (text, index) => {
    // Permitir apenas números
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) {
      // Se o usuário colou múltiplos dígitos
      const pastedDigits = numericText.slice(0, length - index);
      const newDigits = [...digits];
      
      for (let i = 0; i < pastedDigits.length; i++) {
        if (index + i < length) {
          newDigits[index + i] = pastedDigits[i];
        }
      }
      
      setDigits(newDigits);
      
      // Focar no próximo campo vazio ou no último
      const nextEmptyIndex = newDigits.findIndex((digit, idx) => 
        idx >= index && !digit
      );
      const nextIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
      
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
      
      // Chamar onChange com o valor completo
      const fullValue = newDigits.join('');
      onChange?.(fullValue);
    } else {
      // Mudança normal de um dígito
      const newDigits = [...digits];
      newDigits[index] = numericText;
      setDigits(newDigits);
      
      // Chamar onChange com o valor completo
      const fullValue = newDigits.join('');
      onChange?.(fullValue);
      
      // Focar no próximo campo se digitou algo
      if (numericText && index < length - 1) {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }
    }
  };

  const handleKeyPress = (key, index) => {
    if (key === 'Backspace') {
      if (digits[index]) {
        // Se há dígito no campo atual, limpar
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
        
        const fullValue = newDigits.join('');
        onChange?.(fullValue);
      } else if (index > 0) {
        // Se campo está vazio, voltar para o anterior
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
        }
      }
    }
  };

  const handleFocus = (index) => {
    // Selecionar todo o texto quando focar
    if (inputRefs.current[index]) {
      inputRefs.current[index].setSelection(0, 1);
    }
  };

  const clearCode = () => {
    const newDigits = Array(length).fill('');
    setDigits(newDigits);
    onChange?.('');
    
    // Focar no primeiro campo
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.input,
              error && styles.inputError,
              digit && styles.inputFilled,
              disabled && styles.inputDisabled
            ]}
            value={digit}
            onChangeText={(text) => handleDigitChange(text, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            onFocus={() => handleFocus(index)}
            keyboardType="numeric"
            maxLength={1}
            selectTextOnFocus
            editable={!disabled}
            autoFocus={autoFocus && index === 0}
            textAlign="center"
            placeholder="0"
            placeholderTextColor="#ccc"
          />
        ))}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {!disabled && (
        <TouchableOpacity onPress={clearCode} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Limpar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2860',
    marginHorizontal: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputFilled: {
    borderColor: '#2B2860',
    backgroundColor: '#f8f9fa',
  },
  inputError: {
    borderColor: '#ff3b30',
    backgroundColor: '#ffebee',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    color: '#999',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  clearButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CodeInput;
