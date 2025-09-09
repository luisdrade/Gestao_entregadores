import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const KPICard = ({ title, data, color = 'blue', isCurrency = false }) => {
  const formatValue = (value) => {
    if (isCurrency) {
      return `R$ ${parseFloat(value).toFixed(2)}`;
    }
    return value;
  };

  const getCardStyle = () => {
    const baseStyle = [styles.kpiCard];
    switch (color) {
      case 'green':
        return [...baseStyle, styles.greenCard];
      case 'blue':
        return [...baseStyle, styles.blueCard];
      case 'red':
        return [...baseStyle, styles.redCard];
      case 'purple':
        return [...baseStyle, styles.purpleCard];
      case 'orange':
        return [...baseStyle, styles.orangeCard];
      case 'teal':
        return [...baseStyle, styles.tealCard];
      default:
        return [...baseStyle, styles.blueCard];
    }
  };

  return (
    <View style={getCardStyle()}>
      <Text style={styles.kpiCardTitle}>{title}</Text>
      <Text style={styles.kpiCardData}>{formatValue(data)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  kpiCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  greenCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  blueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  redCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  purpleCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  orangeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  tealCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#009688',
  },
  kpiCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  kpiCardData: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default KPICard;
