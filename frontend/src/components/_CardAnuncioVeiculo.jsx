import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';

const _CardAnuncioVeiculo = ({ anuncio }) => {
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(preco);
  };

  const formatarQuilometragem = (km) => {
    return new Intl.NumberFormat('pt-BR').format(km) + ' km';
  };

  const aoPressionarLink = async () => {
    try {
      await Linking.openURL(anuncio.link_externo);
    } catch (error) {
      console.error('Erro ao abrir link:', error);
    }
  };

  return (
    <View style={styles.container}>
      {anuncio.foto && (
        <Image source={{ uri: anuncio.foto }} style={styles.imagem} />
      )}
      
      <View style={styles.conteudo}>
        <View style={styles.header}>
          <Text style={styles.modelo}>{anuncio.modelo}</Text>
          <Text style={styles.ano}>{anuncio.ano}</Text>
        </View>
        
        <View style={styles.detalhes}>
          <Text style={styles.quilometragem}>{formatarQuilometragem(anuncio.quilometragem)}</Text>
          <Text style={styles.localizacao}>{anuncio.localizacao}</Text>
        </View>
        
        <Text style={styles.preco}>{formatarPreco(anuncio.preco)}</Text>
        
        <View style={styles.footer}>
          <Text style={styles.data}>{formatarData(anuncio.data_publicacao)}</Text>
          <TouchableOpacity style={styles.botaoLink} onPress={aoPressionarLink}>
            <Text style={styles.textoLink}>Ver Anúncio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  imagem: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  conteudo: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modelo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ano: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detalhes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quilometragem: {
    fontSize: 14,
    color: '#666',
  },
  localizacao: {
    fontSize: 14,
    color: '#666',
  },
  preco: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B2860',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  data: {
    fontSize: 12,
    color: '#999',
  },
  botaoLink: {
    backgroundColor: '#2B2860',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  textoLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default _CardAnuncioVeiculo;
