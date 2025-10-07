import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

const _Botao = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'outline'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  loading = false,
  style = {},
  textStyle = {},
  icon,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`${variant}Button`], styles[`${size}Button`]];
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }
    
    return [...baseStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${variant}Text`], styles[`${size}Text`]];
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    }
    
    return [...baseStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? '#2B2860' : '#fff'} 
          size="small" 
        />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: '#2B2860',
    borderColor: '#2B2860',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: '#2B2860',
  },
  
  // Sizes
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  
  // States
  disabledButton: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  dangerText: {
    color: '#fff',
  },
  outlineText: {
    color: '#2B2860',
  },
  disabledText: {
    color: '#999',
  },
  
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  iconContainer: {
    marginRight: 8,
  },
});

export default _Botao;
