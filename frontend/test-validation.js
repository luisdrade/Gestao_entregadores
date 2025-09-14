// 🧪 Teste de Validação do Formulário de Edição de Perfil
// Execute este arquivo para testar as validações

const Yup = require('yup');

// Schema de validação (mesmo do arquivo original)
const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .required('Nome é obrigatório'),
  username: Yup.string()
    .trim()
    .min(3, 'Username deve ter pelo menos 3 caracteres')
    .max(20, 'Username deve ter no máximo 20 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username pode conter apenas letras, números e _')
    .required('Username é obrigatório'),
  email: Yup.string()
    .trim()
    .email('Email inválido')
    .max(150, 'Email deve ter no máximo 150 caracteres')
    .required('Email é obrigatório'),
  telefone: Yup.string()
    .trim()
    .required('Telefone é obrigatório')
    .test('telefone-length', 'Telefone deve ter formato válido', function(value) {
      if (!value) return false;
      return value.length >= 14 && value.length <= 15;
    })
    .test('telefone-format', 'Formato de telefone inválido', function(value) {
      if (!value) return false;
      const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      return telefoneRegex.test(value);
    }),
  cpf: Yup.string()
    .trim()
    .required('CPF é obrigatório')
    .test('cpf-length', 'CPF deve ter 14 caracteres (formato: 123.456.789-00)', function(value) {
      if (!value) return false;
      return value.length === 14;
    })
    .test('cpf-format', 'Formato de CPF inválido', function(value) {
      if (!value) return false;
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      return cpfRegex.test(value);
    }),
  dataNascimento: Yup.string()
    .trim()
    .required('Data de nascimento é obrigatória')
    .test('valid-date', 'Data de nascimento inválida', function(value) {
      if (!value || value.trim() === '') return false;
      
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!dateRegex.test(value)) return false;
      
      const [, day, month, year] = value.match(dateRegex);
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      const date = new Date(yearNum, monthNum - 1, dayNum);
      if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
        return false;
      }
      
      const today = new Date();
      if (date > today) return false;
      
      const minYear = today.getFullYear() - 120;
      if (yearNum < minYear) return false;
      
      const maxYear = today.getFullYear() - 16;
      if (yearNum > maxYear) return false;
      
      return true;
    }),
  endereco: Yup.string()
    .trim()
    .min(10, 'Endereço deve ter pelo menos 10 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .required('Endereço é obrigatório'),
  cep: Yup.string()
    .trim()
    .required('CEP é obrigatório')
    .test('cep-format', 'CEP deve ter formato 12345-678', function(value) {
      if (!value) return false;
      const cepRegex = /^\d{5}-\d{3}$/;
      return cepRegex.test(value);
    }),
  cidade: Yup.string()
    .trim()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .required('Cidade é obrigatória'),
  estado: Yup.string()
    .trim()
    .min(2, 'Estado deve ter pelo menos 2 caracteres')
    .max(2, 'Estado deve ter no máximo 2 caracteres')
    .required('Estado é obrigatório'),
});

// Dados de teste
const testData = {
  // Dados válidos
  valid: {
    nome: 'João Silva Santos',
    username: 'joao_silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    dataNascimento: '15/03/1990',
    endereco: 'Rua das Flores, 123, Centro',
    cep: '01234-567',
    cidade: 'São Paulo',
    estado: 'SP'
  },
  
  // Dados inválidos
  invalid: {
    nome: 'A', // Muito curto
    username: 'ab', // Muito curto
    email: 'email-invalido', // Email inválido
    telefone: '11999999999', // Sem formatação
    cpf: '12345678900', // Sem formatação
    dataNascimento: '32/13/2020', // Data inválida
    endereco: 'Rua', // Muito curto
    cep: '12345678', // Sem formatação
    cidade: 'A', // Muito curto
    estado: 'ABC' // Muito longo
  }
};

// Função para testar validação
async function testValidation(data, label) {
  console.log(`\n🧪 Testando: ${label}`);
  console.log('📋 Dados:', data);
  
  try {
    await validationSchema.validate(data, { abortEarly: false });
    console.log('✅ Validação passou - dados válidos');
  } catch (error) {
    console.log('❌ Validação falhou:');
    error.inner.forEach(err => {
      console.log(`   • ${err.path}: ${err.message}`);
    });
  }
}

// Executar testes
async function runTests() {
  console.log('🚀 Iniciando testes de validação...\n');
  
  await testValidation(testData.valid, 'Dados Válidos');
  await testValidation(testData.invalid, 'Dados Inválidos');
  
  console.log('\n✨ Testes concluídos!');
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { validationSchema, testData, testValidation };
