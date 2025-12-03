import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/TermosLGPD.css';

export default function TermosLGPD() {
  const navigate = useNavigate();

  return (
    <div className="termos-container">
      <div className="termos-card">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
        
        <h1 className="termos-title">Termos de Uso e Política de Privacidade - LGPD</h1>
        <p className="termos-date">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <div className="termos-content">
          <section className="termos-section">
            <h2>1. Introdução</h2>
            <p>
              Este documento estabelece os Termos de Uso e a Política de Privacidade do Sistema de Gestão de Entregadores, 
              em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD).
            </p>
            <p>
              Ao utilizar nossa plataforma, você concorda com os termos aqui estabelecidos. Caso não concorde, 
              solicitamos que não utilize nossos serviços.
            </p>
          </section>

          <section className="termos-section">
            <h2>2. Coleta de Dados Pessoais</h2>
            <p>Coletamos os seguintes dados pessoais:</p>
            <ul>
              <li><strong>Dados de Identificação:</strong> Nome completo, username, e-mail e telefone</li>
              <li><strong>Dados de Autenticação:</strong> Senha (armazenada de forma criptografada)</li>
              <li><strong>Dados de Uso:</strong> Informações sobre como você utiliza a plataforma</li>
              <li><strong>Dados de Localização:</strong> Quando necessário para serviços de entrega</li>
              <li><strong>Dados Financeiros:</strong> Informações sobre ganhos e despesas relacionadas ao trabalho</li>
            </ul>
          </section>

          <section className="termos-section">
            <h2>3. Finalidade do Tratamento</h2>
            <p>Utilizamos seus dados pessoais para:</p>
            <ul>
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Autenticar e gerenciar sua conta</li>
              <li>Processar transações e pagamentos</li>
              <li>Enviar comunicações importantes sobre o serviço</li>
              <li>Cumprir obrigações legais e regulatórias</li>
              <li>Prevenir fraudes e garantir a segurança da plataforma</li>
              <li>Gerar relatórios e análises estatísticas (dados anonimizados)</li>
            </ul>
          </section>

          <section className="termos-section">
            <h2>4. Base Legal</h2>
            <p>O tratamento de seus dados pessoais é baseado em:</p>
            <ul>
              <li><strong>Execução de contrato:</strong> Necessário para prestação dos serviços</li>
              <li><strong>Consentimento:</strong> Quando você aceita explicitamente o tratamento</li>
              <li><strong>Legítimo interesse:</strong> Para melhorar nossos serviços e segurança</li>
              <li><strong>Obrigação legal:</strong> Para cumprir exigências legais e regulatórias</li>
            </ul>
          </section>

          <section className="termos-section">
            <h2>5. Compartilhamento de Dados</h2>
            <p>
              Seus dados pessoais podem ser compartilhados apenas nas seguintes situações:
            </p>
            <ul>
              <li>Com prestadores de serviços que nos auxiliam na operação da plataforma (sob contrato de confidencialidade)</li>
              <li>Quando exigido por lei ou ordem judicial</li>
              <li>Para proteger nossos direitos, propriedade ou segurança, bem como de nossos usuários</li>
              <li>Em caso de fusão, aquisição ou venda de ativos (com notificação prévia)</li>
            </ul>
            <p>
              <strong>Não vendemos seus dados pessoais a terceiros.</strong>
            </p>
          </section>

          <section className="termos-section">
            <h2>6. Segurança dos Dados</h2>
            <p>
              Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra 
              acesso não autorizado, alteração, divulgação ou destruição, incluindo:
            </p>
            <ul>
              <li>Criptografia de dados sensíveis</li>
              <li>Controles de acesso rigorosos</li>
              <li>Monitoramento regular de segurança</li>
              <li>Backups regulares dos dados</li>
              <li>Treinamento de equipe em segurança da informação</li>
            </ul>
          </section>

          <section className="termos-section">
            <h2>7. Retenção de Dados</h2>
            <p>
              Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas 
              neste documento, ou conforme exigido por lei. Após esse período, os dados são excluídos ou anonimizados.
            </p>
          </section>

          <section className="termos-section">
            <h2>8. Seus Direitos (LGPD)</h2>
            <p>Você tem os seguintes direitos em relação aos seus dados pessoais:</p>
            <ul>
              <li><strong>Confirmação e Acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
              <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou desatualizados</li>
              <li><strong>Anonimização, Bloqueio ou Eliminação:</strong> Solicitar a remoção de dados desnecessários</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Eliminação:</strong> Solicitar a exclusão de dados tratados com base em consentimento</li>
              <li><strong>Informação:</strong> Obter informações sobre compartilhamento de dados</li>
              <li><strong>Revogação de Consentimento:</strong> Revogar seu consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se ao tratamento de dados em certas circunstâncias</li>
            </ul>
            <p>
              Para exercer seus direitos, entre em contato conosco através dos canais disponíveis na plataforma.
            </p>
          </section>

          <section className="termos-section">
            <h2>9. Cookies e Tecnologias Similares</h2>
            <p>
              Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma 
              e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do navegador.
            </p>
          </section>

          <section className="termos-section">
            <h2>10. Alterações nos Termos</h2>
            <p>
              Podemos atualizar estes termos periodicamente. Notificaremos sobre mudanças significativas através 
              da plataforma ou por e-mail. O uso continuado dos serviços após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="termos-section">
            <h2>11. Contato</h2>
            <p>
              Para questões sobre privacidade, proteção de dados ou exercer seus direitos, entre em contato conosco:
            </p>
            <ul>
              <li>Através da plataforma: Utilize os canais de suporte disponíveis</li>
              <li>E-mail: privacidade@sistemaentregadores.com</li>
            </ul>
          </section>

          <section className="termos-section">
            <h2>12. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pela legislação brasileira, especialmente a Lei Geral de Proteção de Dados 
              (Lei nº 13.709/2018) e o Código de Defesa do Consumidor.
            </p>
          </section>

          <section className="termos-section">
            <h2>13. Consentimento</h2>
            <p>
              Ao criar uma conta e utilizar nossos serviços, você declara que leu, compreendeu e concorda com 
              estes Termos de Uso e Política de Privacidade, consentindo com o tratamento de seus dados pessoais 
              conforme descrito neste documento.
            </p>
          </section>
        </div>

        <div className="termos-footer">
          <button className="back-button-footer" onClick={() => navigate(-1)}>
            ← Voltar
          </button>
        </div>
      </div>
    </div>
  );
}



