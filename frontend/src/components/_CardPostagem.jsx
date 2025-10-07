import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const _CardPostagem = ({ postagem, aoPressionar }) => {
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={aoPressionar}>
      <View style={styles.header}>
        <Text style={styles.autor}>{postagem.autor}</Text>
        <Text style={styles.data}>{formatarData(postagem.data_criacao)}</Text>
      </View>
      
      <Text style={styles.titulo}>{postagem.titulo}</Text>
      
      <Text style={styles.conteudo} numberOfLines={3}>
        {postagem.conteudo}
      </Text>
      
      <View style={styles.footer}>
        <Text style={styles.lerMais}>Ler mais...</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  autor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2860',
  },
  data: {
    fontSize: 12,
    color: '#666',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  conteudo: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    alignItems: 'flex-end',
  },
  lerMais: {
    fontSize: 14,
    color: '#2B2860',
    fontWeight: '500',
  },
});

export default _CardPostagem;
