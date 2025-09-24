import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const _EstadoCarregamento = ({
  isLoading,
  hasError,
  isEmpty,
  onRetry,
  loadingText = 'Carregando...',
  errorText = 'Erro ao carregar dados',
  errorSubtext = 'Verifique sua conexão e tente novamente',
  emptyText = 'Nenhum item encontrado',
  emptySubtext = 'Tente ajustar os filtros ou adicionar novos itens',
  style = {},
  showRetryButton = true,
  size = 'large',
}) => {
  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size={size} color="#007AFF" />
        <Text style={styles.loadingText}>{loadingText}</Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorIcon}>
          <Text style={styles.errorEmoji}>⚠️</Text>
        </View>
        <Text style={styles.errorText}>{errorText}</Text>
        <Text style={styles.errorSubtext}>{errorSubtext}</Text>
        {showRetryButton && onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyEmoji}>📭</Text>
        </View>
        <Text style={styles.emptyText}>{emptyText}</Text>
        <Text style={styles.emptySubtext}>{emptySubtext}</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorIcon: {
    marginBottom: 15,
  },
  errorEmoji: {
    fontSize: 48,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyIcon: {
    marginBottom: 15,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default _EstadoCarregamento;
