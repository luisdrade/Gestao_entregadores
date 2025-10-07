import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const _NavegadorAbas = ({
  tabs = [],
  activeTab,
  onTabPress,
  style = {},
  orientation = 'horizontal', // 'horizontal' or 'vertical'
  variant = 'default', // 'default', 'pills', 'underline'
}) => {
  const handleTabPress = (tab) => {
    if (onTabPress) {
      onTabPress(tab);
    }
  };

  const getTabStyle = (tab) => {
    const isActive = activeTab === tab.key;
    const baseStyle = [styles.tab];
    
    if (orientation === 'vertical') {
      baseStyle.push(styles.verticalTab);
    }
    
    if (variant === 'pills') {
      baseStyle.push(styles.pillTab);
      if (isActive) {
        baseStyle.push(styles.activePillTab);
      }
    } else if (variant === 'underline') {
      baseStyle.push(styles.underlineTab);
      if (isActive) {
        baseStyle.push(styles.activeUnderlineTab);
      }
    } else {
      // default variant
      if (isActive) {
        baseStyle.push(styles.activeTab);
      }
    }
    
    return baseStyle;
  };

  const getTextStyle = (tab) => {
    const isActive = activeTab === tab.key;
    const baseStyle = [styles.tabText];
    
    if (variant === 'pills' && isActive) {
      baseStyle.push(styles.activePillText);
    } else if (variant === 'underline' && isActive) {
      baseStyle.push(styles.activeUnderlineText);
    } else if (isActive) {
      baseStyle.push(styles.activeText);
    }
    
    return baseStyle;
  };

  return (
    <View style={[
      styles.container,
      orientation === 'vertical' && styles.verticalContainer,
      style
    ]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={getTabStyle(tab)}
          onPress={() => handleTabPress(tab)}
          activeOpacity={0.7}
        >
          {tab.icon && (
            <View style={styles.iconContainer}>
              {tab.icon}
            </View>
          )}
          <Text style={getTextStyle(tab)}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  verticalContainer: {
    flexDirection: 'column',
    padding: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  verticalTab: {
    flex: 0,
    marginBottom: 4,
  },
  activeTab: {
    backgroundColor: '#2B2860',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  iconContainer: {
    marginRight: 6,
  },
  
  // Pills variant
  pillTab: {
    backgroundColor: 'transparent',
  },
  activePillTab: {
    backgroundColor: '#2B2860',
  },
  activePillText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // Underline variant
  underlineTab: {
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    borderRadius: 0,
  },
  activeUnderlineTab: {
    borderBottomColor: '#2B2860',
  },
  activeUnderlineText: {
    color: '#2B2860',
    fontWeight: 'bold',
  },
});

export default _NavegadorAbas;
