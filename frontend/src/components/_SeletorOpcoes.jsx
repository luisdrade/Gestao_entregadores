import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const _SeletorOpcoes = ({
  label,
  options = [],
  selectedValue,
  onSelect,
  error = false,
  errorMessage = '',
  style = {},
  multiple = false,
  orientation = 'horizontal', // 'horizontal' or 'vertical'
}) => {
  const handleSelect = (value) => {
    if (multiple) {
      const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      onSelect(newValues);
    } else {
      onSelect(value);
    }
  };

  const isSelected = (value) => {
    if (multiple) {
      return Array.isArray(selectedValue) && selectedValue.includes(value);
    }
    return selectedValue === value;
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.optionsContainer,
        orientation === 'vertical' && styles.verticalContainer,
        error && styles.errorContainer
      ]}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option.value || index}
            style={[
              styles.option,
              orientation === 'vertical' && styles.verticalOption,
              isSelected(option.value) && styles.selectedOption,
              error && styles.optionError
            ]}
            onPress={() => handleSelect(option.value)}
            activeOpacity={0.7}
          >
            {option.icon && (
              <View style={styles.iconContainer}>
                {option.icon}
              </View>
            )}
            <Text style={[
              styles.optionText,
              isSelected(option.value) && styles.selectedOptionText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
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
  optionsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  verticalContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  errorContainer: {
    borderColor: '#FF6B6B',
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  verticalOption: {
    flex: 0,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionError: {
    borderColor: '#FF6B6B',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#fff',
  },
  iconContainer: {
    marginRight: 4,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
  },
});

export default _SeletorOpcoes;
