import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DatePicker({ 
  value, 
  onDateChange, 
  placeholder = "DD/MM/AAAA",
  label = "Data",
  error = false,
  errorMessage = "",
  style = {}
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const hideDatePickerModal = () => {
    setShowDatePicker(false);
  };

  const confirmDate = () => {
    // Formatar a data para DD/MM/AAAA
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    
    onDateChange(formattedDate);
    hideDatePickerModal();
  };

  const handleDayChange = (text) => {
    const day = parseInt(text) || 1;
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  const handleMonthChange = (text) => {
    const month = parseInt(text) || 1;
    const newDate = new Date(selectedDate);
    newDate.setMonth(month - 1);
    setSelectedDate(newDate);
  };

  const handleYearChange = (text) => {
    const year = parseInt(text) || 2024;
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    setSelectedDate(newDate);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      {/* Campo de seleção */}
      <TouchableOpacity 
        style={[styles.selectField, error && styles.inputError]}
        onPress={showDatePickerModal}
      >
        <Text style={[
          styles.dateText, 
          !value && styles.placeholderText
        ]}>
          {value || placeholder}
        </Text>
        <Ionicons name="calendar" size={20} color="#666" style={styles.calendarIcon} />
      </TouchableOpacity>
      
      {error && errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Modal de seleção de data */}
      <Modal
        visible={showDatePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={hideDatePickerModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a data</Text>
            
            {/* Inputs para dia, mês e ano */}
            <View style={styles.dateInputsRow}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateInputLabel}>Dia</Text>
                <TextInput
                  style={styles.dateInputField}
                  placeholder="DD"
                  value={selectedDate.getDate().toString()}
                  onChangeText={handleDayChange}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateInputLabel}>Mês</Text>
                <TextInput
                  style={styles.dateInputField}
                  placeholder="MM"
                  value={(selectedDate.getMonth() + 1).toString()}
                  onChangeText={handleMonthChange}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateInputLabel}>Ano</Text>
                <TextInput
                  style={styles.dateInputField}
                  placeholder="AAAA"
                  value={selectedDate.getFullYear().toString()}
                  onChangeText={handleYearChange}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>
            
            <TouchableOpacity style={styles.confirmButton} onPress={confirmDate}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={hideDatePickerModal}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  placeholderText: {
    color: '#666',
  },
  calendarIcon: {
    marginLeft: 10,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  dateInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  dateInputContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  dateInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  dateInputField: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
