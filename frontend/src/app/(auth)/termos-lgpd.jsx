import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TermosLGPD() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#5B9BD5" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.title}>Termos de Uso e Política de Privacidade - LGPD</Text>
        <Text style={styles.date}>
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introdução</Text>
          <Text style={styles.text}>
            Este documento estabelece os Termos de Uso e a Política de Privacidade do Sistema de Gestão de Entregadores, 
            em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD).
          </Text>
          <Text style={styles.text}>
            Ao utilizar nossa plataforma, você concorda com os termos aqui estabelecidos. Caso não concorde, 
            solicitamos que não utilize nossos serviços.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Coleta de Dados Pessoais</Text>
          <Text style={styles.text}>Coletamos os seguintes dados pessoais:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Dados de Identificação:</Text> Nome completo, username, e-mail e telefone
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Dados de Autenticação:</Text> Senha (armazenada de forma criptografada)
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Dados de Uso:</Text> Informações sobre como você utiliza a plataforma
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Dados de Localização:</Text> Quando necessário para serviços de entrega
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Dados Financeiros:</Text> Informações sobre ganhos e despesas relacionadas ao trabalho
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Finalidade do Tratamento</Text>
          <Text style={styles.text}>Utilizamos seus dados pessoais para:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>Fornecer e melhorar nossos serviços</Text>
            <Text style={styles.bulletItem}>Autenticar e gerenciar sua conta</Text>
            <Text style={styles.bulletItem}>Processar transações e pagamentos</Text>
            <Text style={styles.bulletItem}>Enviar comunicações importantes sobre o serviço</Text>
            <Text style={styles.bulletItem}>Cumprir obrigações legais e regulatórias</Text>
            <Text style={styles.bulletItem}>Prevenir fraudes e garantir a segurança da plataforma</Text>
            <Text style={styles.bulletItem}>Gerar relatórios e análises estatísticas (dados anonimizados)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Base Legal</Text>
          <Text style={styles.text}>O tratamento de seus dados pessoais é baseado em:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Execução de contrato:</Text> Necessário para prestação dos serviços
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Consentimento:</Text> Quando você aceita explicitamente o tratamento
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Legítimo interesse:</Text> Para melhorar nossos serviços e segurança
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Obrigação legal:</Text> Para cumprir exigências legais e regulatórias
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Compartilhamento de Dados</Text>
          <Text style={styles.text}>
            Seus dados pessoais podem ser compartilhados apenas nas seguintes situações:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              Com prestadores de serviços que nos auxiliam na operação da plataforma (sob contrato de confidencialidade)
            </Text>
            <Text style={styles.bulletItem}>Quando exigido por lei ou ordem judicial</Text>
            <Text style={styles.bulletItem}>
              Para proteger nossos direitos, propriedade ou segurança, bem como de nossos usuários
            </Text>
            <Text style={styles.bulletItem}>
              Em caso de fusão, aquisição ou venda de ativos (com notificação prévia)
            </Text>
          </View>
          <Text style={[styles.text, styles.bold]}>
            Não vendemos seus dados pessoais a terceiros.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Segurança dos Dados</Text>
          <Text style={styles.text}>
            Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra 
            acesso não autorizado, alteração, divulgação ou destruição, incluindo:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>Criptografia de dados sensíveis</Text>
            <Text style={styles.bulletItem}>Controles de acesso rigorosos</Text>
            <Text style={styles.bulletItem}>Monitoramento regular de segurança</Text>
            <Text style={styles.bulletItem}>Backups regulares dos dados</Text>
            <Text style={styles.bulletItem}>Treinamento de equipe em segurança da informação</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Retenção de Dados</Text>
          <Text style={styles.text}>
            Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas 
            neste documento, ou conforme exigido por lei. Após esse período, os dados são excluídos ou anonimizados.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Seus Direitos (LGPD)</Text>
          <Text style={styles.text}>Você tem os seguintes direitos em relação aos seus dados pessoais:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Confirmação e Acesso:</Text> Saber se tratamos seus dados e acessá-los
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Correção:</Text> Solicitar correção de dados incompletos ou desatualizados
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Anonimização, Bloqueio ou Eliminação:</Text> Solicitar a remoção de dados desnecessários
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Portabilidade:</Text> Receber seus dados em formato estruturado
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Eliminação:</Text> Solicitar a exclusão de dados tratados com base em consentimento
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Informação:</Text> Obter informações sobre compartilhamento de dados
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Revogação de Consentimento:</Text> Revogar seu consentimento a qualquer momento
            </Text>
            <Text style={styles.bulletItem}>
              <Text style={styles.bold}>Oposição:</Text> Opor-se ao tratamento de dados em certas circunstâncias
            </Text>
          </View>
          <Text style={styles.text}>
            Para exercer seus direitos, entre em contato conosco através dos canais disponíveis na plataforma.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Cookies e Tecnologias Similares</Text>
          <Text style={styles.text}>
            Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma 
            e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do navegador.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Alterações nos Termos</Text>
          <Text style={styles.text}>
            Podemos atualizar estes termos periodicamente. Notificaremos sobre mudanças significativas através 
            da plataforma ou por e-mail. O uso continuado dos serviços após as alterações constitui aceitação dos novos termos.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Contato</Text>
          <Text style={styles.text}>
            Para questões sobre privacidade, proteção de dados ou exercer seus direitos, entre em contato conosco:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>Através da plataforma: Utilize os canais de suporte disponíveis</Text>
            <Text style={styles.bulletItem}>E-mail: privacidade@sistemaentregadores.com</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Lei Aplicável</Text>
          <Text style={styles.text}>
            Estes termos são regidos pela legislação brasileira, especialmente a Lei Geral de Proteção de Dados 
            (Lei nº 13.709/2018) e o Código de Defesa do Consumidor.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Consentimento</Text>
          <Text style={styles.text}>
            Ao criar uma conta e utilizar nossos serviços, você declara que leu, compreendeu e concorda com 
            estes Termos de Uso e Política de Privacidade, consentindo com o tratamento de seus dados pessoais 
            conforme descrito neste documento.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => router.back()}
        >
          <Text style={styles.footerButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    color: '#5B9BD5',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2860',
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2B2860',
    marginBottom: 12,
    marginTop: 10,
  },
  text: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: '600',
    color: '#2B2860',
  },
  bulletList: {
    marginVertical: 10,
    paddingLeft: 10,
  },
  bulletItem: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
    textAlign: 'justify',
  },
  footerButton: {
    backgroundColor: '#2B2860',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#2B2860',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});



