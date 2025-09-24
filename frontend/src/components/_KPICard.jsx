import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';

const KPICard = ({ 
  title, 
  data, 
  color = 'blue', 
  isCurrency = false,
  subtitle,
  icon,
  onPress,
  style = {},
  size = 'medium', // 'small', 'medium', 'large'
  variant = 'default', // 'default', 'outlined', 'filled'
}) => {
  const formatValue = (value) => {
    if (isCurrency) {
      return `R$ ${parseFloat(value).toFixed(2)}`;
    }
    if (typeof value === 'number') {
      return value.toLocaleString('pt-BR');
    }
    return value;
  };

  const getCardStyle = () => {
    const baseStyle = [styles.kpiCard, styles[`${size}Card`], styles[`${variant}Card`]];
    
    // Manter compatibilidade com cores nomeadas
    if (typeof color === 'string' && ['green', 'blue', 'red', 'purple', 'orange', 'teal'].includes(color)) {
      baseStyle.push(styles[`${color}Card`]);
    }
    
    return [...baseStyle, style];
  };

  const getColorStyle = () => {
    if (variant === 'filled') {
      return { backgroundColor: color };
    }
    if (typeof color === 'string' && !['green', 'blue', 'red', 'purple', 'orange', 'teal'].includes(color)) {
      return { borderLeftColor: color };
    }
    return {};
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[getCardStyle(), getColorStyle()]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.content}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
            {icon}
          </View>
        )}
        
        <View style={styles.textContainer}>
          <Text style={[
            styles.kpiCardTitle,
            variant === 'filled' && styles.filledText
          ]}>
            {title}
          </Text>
          
          <Text style={[
            styles.kpiCardData,
            variant === 'filled' && styles.filledText,
            { color: variant === 'filled' ? '#fff' : '#007AFF' }
          ]}>
            {formatValue(data)}
          </Text>
          
          {subtitle && (
            <Text style={[
              styles.subtitle,
              variant === 'filled' && styles.filledSubtitle
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  kpiCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Sizes
  smallCard: {
    padding: 12,
    minHeight: 80,
  },
  mediumCard: {
    padding: 15,
    minHeight: 100,
  },
  largeCard: {
    padding: 20,
    minHeight: 120,
  },
  
  // Variants
  defaultCard: {
    borderLeftWidth: 4,
  },
  outlinedCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filledCard: {
    borderWidth: 0,
  },
  
  // Named colors (mantendo compatibilidade)
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
  
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  textContainer: {
    flex: 1,
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
  
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  
  // Filled variant text styles
  filledText: {
    color: '#fff',
  },
  
  filledSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default KPICard;
