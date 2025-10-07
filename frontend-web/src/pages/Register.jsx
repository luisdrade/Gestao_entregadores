import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import '../styles/pages/Register.css';

const validacaoRegister = Yup.object().shape({
  nome: Yup.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .required('Nome é obrigatório'),
  username: Yup.string()
    .min(3, 'Username deve ter pelo menos 3 caracteres')
    .max(20, 'Username deve ter no máximo 20 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username pode conter apenas letras, números e _')
    .required('Username é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  telefone: Yup.string()
    .min(14, 'Telefone deve ter pelo menos 14 caracteres')
    .required('Telefone é obrigatório'),
  senha: Yup.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .required('Senha é obrigatória'),
  confirmarSenha: Yup.string()
    .oneOf([Yup.ref('senha'), null], 'As senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
});

// Função para formatar telefone
const formatPhone = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleRegister = async (values) => {
    setIsSubmitting(true);
    setFieldErrors({});
    
    try {
      // Mapear os campos para o formato esperado pelo backend
      const registrationData = {
        nome: values.nome,
        username: values.username,
        email: values.email,
        telefone: values.telefone,
        password: values.senha,
        password_confirm: values.confirmarSenha, 
      };
      
      const result = await register(registrationData);
      if (result.success) {
        alert('Conta criada com sucesso! Faça login para continuar.');
        navigate('/login');
      } else {
        const newFieldErrors = {};
        
        if (result.error && result.error.details) {
          const details = result.error.details;
          
          // Mapear erros do back para campos do front
          if (details.email) {
            newFieldErrors.email = details.email[0];
          }
          if (details.username) {
            newFieldErrors.username = details.username[0];
          }
          if (details.telefone) {
            newFieldErrors.telefone = details.telefone[0];
          }
          if (details.password) {
            newFieldErrors.senha = details.password[0];
          }
          if (details.password_confirm) {
            newFieldErrors.confirmarSenha = details.password_confirm[0];
          }
          if (details.nome) {
            newFieldErrors.nome = details.nome[0];
          }
          if (details.non_field_errors) {
            newFieldErrors.confirmarSenha = details.non_field_errors[0];
          }
        } else if (result.error && typeof result.error === 'string') {
          newFieldErrors.general = result.error;
        }
        
        setFieldErrors(newFieldErrors);
      }
    } catch (error) {
      setFieldErrors({ general: 'Erro inesperado ao criar conta' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Cadastro</h1>
        
        <Formik
          initialValues={{
            nome: '',
            username: '',
            email: '',
            telefone: '',
            senha: '',
            confirmarSenha: '',
          }}
          validationSchema={validacaoRegister}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <div className="form-group half-width">
                  <div className="input-container">
                    <input 
                      type="text" 
                      name="nome" 
                      value={values.nome} 
                      onChange={(e) => {
                        handleChange('nome')(e);
                        if (fieldErrors.nome) {
                          setFieldErrors(prev => ({ ...prev, nome: null }));
                        }
                      }}
                      onBlur={handleBlur('nome')}
                      className={`form-input ${(touched.nome && errors.nome) || fieldErrors.nome ? 'input-error' : ''}`}
                    />
                    <label className={`form-label ${values.nome ? 'floating' : ''}`}>Nome</label>
                  </div>
                  {(touched.nome && errors.nome) && (
                    <div className="field-error">{errors.nome}</div>
                  )}
                  {fieldErrors.nome && (
                    <div className="field-error">{fieldErrors.nome}</div>
                  )}
                </div>

                <div className="form-group half-width">
                  <div className="input-container username-container">
                    <span className="username-prefix">@</span>
                    <input 
                      type="text" 
                      name="username" 
                      value={values.username} 
                      onChange={(e) => {
                        handleChange('username')(e);
                        if (fieldErrors.username) {
                          setFieldErrors(prev => ({ ...prev, username: null }));
                        }
                      }}
                      onBlur={handleBlur('username')}
                      className={`form-input username-input ${(touched.username && errors.username) || fieldErrors.username ? 'input-error' : ''}`}
                      autoCapitalize="none"
                    />
                    <label className={`form-label username-label ${values.username ? 'floating' : ''}`}>Usuário</label>
                  </div>
                  {(touched.username && errors.username) && (
                    <div className="field-error">{errors.username}</div>
                  )}
                  {fieldErrors.username && (
                    <div className="field-error">{fieldErrors.username}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <input 
                    type="email" 
                    name="email" 
                    value={values.email} 
                    onChange={(e) => {
                      handleChange('email')(e);
                      if (fieldErrors.email) {
                        setFieldErrors(prev => ({ ...prev, email: null }));
                      }
                    }}
                    onBlur={handleBlur('email')}
                    className={`form-input ${(touched.email && errors.email) || fieldErrors.email ? 'input-error' : ''}`}
                    autoCapitalize="none"
                  />
                  <label className={`form-label ${values.email ? 'floating' : ''}`}>E-mail</label>
                </div>
                {(touched.email && errors.email) && (
                  <div className="field-error">{errors.email}</div>
                )}
                {fieldErrors.email && (
                  <div className="field-error">{fieldErrors.email}</div>
                )}
              </div>

              <div className="form-group">
                <div className="input-container">
                  <input 
                    type="tel"
                    name="telefone"
                    value={values.telefone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setFieldValue('telefone', formatted);
                      if (fieldErrors.telefone) {
                        setFieldErrors(prev => ({ ...prev, telefone: null }));
                      }
                    }}
                    onBlur={handleBlur('telefone')}
                    className={`form-input ${(touched.telefone && errors.telefone) || fieldErrors.telefone ? 'input-error' : ''}`}
                  />
                  <label className={`form-label ${values.telefone ? 'floating' : ''}`}>Telefone</label>
                </div>
                {(touched.telefone && errors.telefone) && (
                  <div className="field-error">{errors.telefone}</div>
                )}
                {fieldErrors.telefone && (
                  <div className="field-error">{fieldErrors.telefone}</div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group half-width">
                  <div className="input-container">
                    <input 
                      type="password" 
                      name="senha" 
                      value={values.senha} 
                      onChange={(e) => {
                        handleChange('senha')(e);
                        if (fieldErrors.senha) {
                          setFieldErrors(prev => ({ ...prev, senha: null }));
                        }
                      }}
                      onBlur={handleBlur('senha')}
                      className={`form-input ${(touched.senha && errors.senha) || fieldErrors.senha ? 'input-error' : ''}`}
                      autoCapitalize="none"
                    />
                    <label className={`form-label ${values.senha ? 'floating' : ''}`}>Senha</label>
                  </div>
                  {(touched.senha && errors.senha) && (
                    <div className="field-error">{errors.senha}</div>
                  )}
                  {fieldErrors.senha && (
                    <div className="field-error">{fieldErrors.senha}</div>
                  )}
                </div>

                <div className="form-group half-width">
                  <div className="input-container">
                    <input 
                      type="password" 
                      name="confirmarSenha" 
                      value={values.confirmarSenha} 
                      onChange={(e) => {
                        handleChange('confirmarSenha')(e);
                        if (fieldErrors.confirmarSenha) {
                          setFieldErrors(prev => ({ ...prev, confirmarSenha: null }));
                        }
                      }}
                      onBlur={handleBlur('confirmarSenha')}
                      className={`form-input ${(touched.confirmarSenha && errors.confirmarSenha) || fieldErrors.confirmarSenha ? 'input-error' : ''}`}
                      autoCapitalize="none"
                    />
                    <label className={`form-label ${values.confirmarSenha ? 'floating' : ''}`}>Confirmar Senha</label>
                  </div>
                  {(touched.confirmarSenha && errors.confirmarSenha) && (
                    <div className="field-error">{errors.confirmarSenha}</div>
                  )}
                  {fieldErrors.confirmarSenha && (
                    <div className="field-error">{fieldErrors.confirmarSenha}</div>
                  )}
                </div>
              </div>

              {fieldErrors.general && (
                <div className="register-error">{fieldErrors.general}</div>
              )}

              <button 
                type="submit" 
                className="register-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Cadastrando...' : 'CADASTRAR'}
              </button>
              
              <div className="divider"></div>
              <Link 
                to="/login" 
                className="login-link-button"
              >
                JÁ TENHO CONTA
              </Link>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}