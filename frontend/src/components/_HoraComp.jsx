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

export default function TimePicker({ 
  value, 
  onTimeChange, 
  placeholder = "HH:MM",
  label = "Horário",
  error = false,
  errorMessage = "",
  style = {}
}) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(() => {
    if (value) {
      const [hora, minuto] = value.split(':');
      return { hora: parseInt(hora) || 0, minuto: parseInt(minuto) || 0 };
    }
    return { hora: 0, minuto: 0 };
  });

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const hideTimePickerModal = () => {
    setShowTimePicker(false);
  };

  const confirmTime = () => {
    const hora = selectedTime.hora.toString().padStart(2, '0');
    const minuto = selectedTime.minuto.toString().padStart(2, '0');
    const timeString = `${hora}:${minuto}`;
    
    onTimeChange(timeString);
    hideTimePickerModal();
  };

  const handleHoraChange = (text) => {
    const hora = parseInt(text) || 0;
    if (hora >= 0 && hora <= 23) {
      setSelectedTime(prev => ({ ...prev, hora }));
    }
  };

  const handleMinutoChange = (text) => {
    const minuto = parseInt(text) || 0;
    if (minuto >= 0 && minuto <= 59) {
      setSelectedTime(prev => ({ ...prev, minuto }));
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      {/* Campo de seleção */}
      <TouchableOpacity 
        style={[styles.selectField, error && styles.inputError]}
        onPress={showTimePickerModal}
      >
        <Text style={[
          styles.timeText, 
          !value && styles.placeholderText
        ]}>
          {value || placeholder}
        </Text>
        <Ionicons name="time" size={20} color="#666" style={styles.timeIcon} />
      </TouchableOpacity>
      
      {error && errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Modal de seleção de horário */}
      <Modal
        visible={showTimePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={hideTimePickerModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o horário</Text>
            
            {/* Inputs para hora e minuto */}
            <View style={styles.timeInputsRow}>
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeInputLabel}>Hora</Text>
                <TextInput
                  style={styles.timeInputField}
                  placeholder="00"
                  value={selectedTime.hora.toString()}
                  onChangeText={handleHoraChange}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              
              <Text style={styles.timeSeparator}>:</Text>
              
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeInputLabel}>Minuto</Text>
                <TextInput
                  style={styles.timeInputField}
                  placeholder="00"
                  value={selectedTime.minuto.toString()}
                  onChangeText={handleMinutoChange}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            </View>
            
            <TouchableOpacity style={styles.confirmButton} onPress={confirmTime}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={hideTimePickerModal}>
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
  timeText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  placeholderText: {
    color: '#666',
  },
  timeIcon: {
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
  timeInputsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  timeInputContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  timeInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  timeInputField: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    width: 80,
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 10,
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
