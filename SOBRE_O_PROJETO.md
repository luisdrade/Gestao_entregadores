# 📱 O Que É Este Projeto? (Explicação Simples)

Olá! Este documento vai explicar tudo sobre este projeto de uma forma bem simples, como se você tivesse 14 anos. 😊

---

## 🎯 O Que Este Aplicativo Faz?

Imagine que você é um entregador (pessoa que entrega comida, pacotes, etc). Este aplicativo é como um **assistente pessoal digital** que ajuda entregadores a:

- 📝 **Anotar** todas as entregas que fizeram
- 💰 **Controlar** quanto dinheiro ganharam e gastaram
- 📊 **Ver gráficos** mostrando se estão ganhando mais ou menos
- 🚗 **Cadastrar** seus veículos (moto, carro, bicicleta)
- 👥 **Conversar** com outros entregadores em uma comunidade
- 📈 **Ver relatórios** de quanto trabalharam no mês

É tipo um **diário + calculadora + rede social** só para entregadores!

---

## 🏗️ Como O Aplicativo Funciona?

O aplicativo tem **3 partes principais** que trabalham juntas:

### 1. 📱 **App Mobile** (para celular)
- É o aplicativo que o entregador baixa no celular
- Funciona no Android e iPhone
- O entregador usa no dia a dia enquanto trabalha

### 2. 🌐 **Site Web** (para computador)
- É um site que abre no navegador (Chrome, Firefox, etc)
- Tem gráficos maiores e mais detalhados
- É melhor para ver relatórios e estatísticas

### 3. ⚙️ **Servidor** (o "cérebro" do sistema)
- É como um computador na internet que guarda todas as informações
- Quando você salva algo no app, ele vai para o servidor
- É ele que faz os cálculos e organiza tudo

**Analogia simples**: 
- O **app mobile** = seu caderninho de anotações
- O **site web** = sua planilha no computador
- O **servidor** = um cofre na nuvem que guarda tudo seguro

---

## ✨ Funcionalidades (O Que Você Pode Fazer)

### 🔐 **1. Login e Cadastro**
- Criar uma conta com email e senha
- Fazer login para entrar no sistema
- Recuperar senha se esquecer
- **Segurança extra**: Autenticação de dois fatores (2FA) - tipo um código que chega no celular

### 📊 **2. Dashboard (Painel Principal)**
- Ver um resumo do seu dia de trabalho
- Quantas entregas fez hoje
- Quanto ganhou hoje
- Quanto gastou hoje
- Quanto lucrou (ganhou - gastou)

### 💰 **3. Controle Financeiro**
- **Cadastrar despesas**: gasolina, manutenção do veículo, etc
- **Ver ganhos**: quanto recebeu por cada entrega
- **Calcular lucro**: ganhos - despesas = lucro real
- **Categorizar gastos**: separar por tipo (combustível, comida, etc)

### 📦 **4. Gestão de Entregas**
- Registrar cada entrega que fez
- Marcar se entregou com sucesso ou não
- Ver histórico de todas as entregas
- Calcular quantas entregas fez no mês

### 🚗 **5. Cadastro de Veículos**
- Cadastrar sua moto, carro ou bicicleta
- Ver todos os veículos cadastrados
- Editar informações dos veículos
- Deletar veículos que não usa mais

### 📈 **6. Relatórios e Estatísticas**
- Ver gráficos mostrando seu desempenho
- Comparar ganhos de diferentes meses
- Ver quantos dias trabalhou
- Exportar relatórios em PDF ou Excel

### 👥 **7. Comunidade**
- Postar mensagens para outros entregadores
- Ver posts de outros entregadores
- Comentar em posts
- Anunciar veículos para venda
- Ver anúncios de veículos

### 👤 **8. Perfil**
- Editar suas informações pessoais
- Mudar foto de perfil
- Alterar senha
- Configurar autenticação de dois fatores (2FA)

### 🛡️ **9. Painel Administrativo** (só para admins)
- Ver todos os usuários cadastrados
- Ativar ou desativar contas
- Gerenciar o sistema
- Ver estatísticas gerais

---

## 💻 Tecnologias Usadas (As "Ferramentas" do Projeto)

Vou explicar de forma simples o que cada tecnologia faz:

### **Para o App Mobile (Celular):**

- **React Native** 📱
  - É uma "ferramenta" que permite criar apps para Android e iPhone ao mesmo tempo
  - Tipo escrever o código uma vez e funcionar nos dois sistemas

- **Expo** 🚀
  - É uma plataforma que facilita criar apps
  - Tipo um "kit de ferramentas" pronto para usar

- **JavaScript** 📝
  - É a linguagem de programação usada
  - É como o "idioma" que o computador entende

### **Para o Site Web (Computador):**

- **React** ⚛️
  - É uma biblioteca para criar sites modernos
  - Faz o site ser rápido e interativo

- **Vite** ⚡
  - É uma ferramenta que deixa o desenvolvimento mais rápido
  - Tipo um "turbo" para o site

- **Material-UI (MUI)** 🎨
  - É um conjunto de componentes bonitos prontos
  - Tipo "peças de lego" para montar a interface

- **JavaScript** 📝
  - Mesma linguagem do app mobile

### **Para o Servidor (Backend):**

- **Python** 🐍
  - É uma linguagem de programação muito usada
  - É como o "idioma" do servidor

- **Django** 🎯
  - É um "framework" (tipo um esqueleto) para criar servidores
  - Facilita muito o trabalho

- **Django REST Framework** 🔌
  - É uma parte do Django que cria APIs
  - API = forma de o app e site conversarem com o servidor

- **PostgreSQL / MySQL** 🗄️
  - São bancos de dados (onde guarda as informações)
  - Tipo um "armário gigante" organizado para guardar dados

### **Outras Ferramentas:**

- **Axios** 📡
  - Faz o app/site conversar com o servidor
  - Tipo um "mensageiro" que leva e traz informações

- **JWT (JSON Web Token)** 🔑
  - É um sistema de segurança
  - Tipo um "passe" que prova que você está logado

- **Git** 📦
  - É um sistema para controlar versões do código
  - Tipo um "histórico" que guarda todas as mudanças

---

## 🎨 Como Tudo Funciona Juntos?

Vou dar um exemplo prático:

**Cenário**: Um entregador quer registrar uma entrega

1. 📱 **No app mobile**: O entregador abre o app, preenche um formulário e clica em "Salvar"

2. 📡 **O app envia**: O app usa Axios para enviar os dados para o servidor (tipo enviar uma carta)

3. ⚙️ **O servidor recebe**: O Django (servidor) recebe os dados e valida se está tudo certo

4. 🗄️ **Salva no banco**: O PostgreSQL guarda a informação de forma organizada

5. ✅ **Confirmação**: O servidor envia uma resposta de "sucesso" de volta

6. 📱 **App atualiza**: O app mostra uma mensagem "Entrega salva com sucesso!"

7. 🌐 **Site também atualiza**: Se o entregador abrir o site web, verá a nova entrega lá também

**Tudo isso acontece em menos de 1 segundo!** ⚡

---

## 📂 Estrutura do Projeto (Onde Está Cada Coisa)

```
Gestao_entregadores/
│
├── 📱 frontend/          → App Mobile (React Native)
│   └── src/
│       ├── app/         → Telas do app
│       ├── components/   → Componentes reutilizáveis
│       └── services/    → Comunicação com servidor
│
├── 🌐 frontend-web/     → Site Web (React)
│   └── src/
│       ├── pages/       → Páginas do site
│       ├── components/  → Componentes reutilizáveis
│       └── services/    → Comunicação com servidor
│
├── ⚙️ backend/          → Servidor (Django)
│   ├── usuarios/        → Sistema de usuários
│   ├── registro_entregadespesa/ → Entregas e despesas
│   ├── comunidade/      → Sistema de comunidade
│   └── sistema/         → Configurações gerais
│
├── 📚 docs/             → Documentação do projeto
└── 🛠️ scripts/          → Scripts úteis
```

---

## 🎓 Por Que Este Projeto Foi Feito?

Este projeto foi desenvolvido como um **Trabalho de Conclusão de Curso (TCC)**. 

**O que isso significa?**
- É um projeto grande que um estudante de faculdade faz no final do curso
- Precisa mostrar tudo que aprendeu
- Precisa ser útil e resolver um problema real
- Neste caso, ajuda entregadores a organizarem melhor seu trabalho e finanças

---

## 🚀 Como Usar Este Projeto?

### Para Desenvolvedores (Pessoas que vão mexer no código):

1. **Instalar tudo**:
   - Backend: `pip install -r requirements.txt`
   - Frontend Mobile: `npm install` (na pasta frontend)
   - Frontend Web: `npm install` (na pasta frontend-web)

2. **Rodar o servidor**: `python manage.py runserver`

3. **Rodar o app mobile**: `npm start` (na pasta frontend)

4. **Rodar o site web**: `npm run dev` (na pasta frontend-web)

### Para Usuários Finais (Entregadores):

1. **Baixar o app** no celular (quando estiver pronto)
2. **Criar uma conta**
3. **Começar a usar** para registrar entregas e controlar finanças

---

## 🎯 Resumo Super Rápido

**O que é?** 
→ Um aplicativo para entregadores controlarem entregas e dinheiro

**O que faz?**
→ Registra entregas, calcula ganhos/gastos, mostra gráficos, tem comunidade

**Como funciona?**
→ App mobile + Site web + Servidor trabalhando juntos

**Tecnologias?**
→ React Native, React, Django, Python, JavaScript

**Por quê?**
→ TCC de faculdade para ajudar entregadores

---

## 💡 Curiosidades

- O projeto usa **autenticação de dois fatores (2FA)** para mais segurança
- Os dados são guardados em um **banco de dados** na nuvem
- O código está organizado de forma **modular** (cada parte faz uma coisa)
- Tem **documentação completa** para quem quiser entender melhor

---

## ❓ Dúvidas?

Se você tiver dúvidas sobre alguma parte do projeto, pode:
- Ler a documentação na pasta `docs/`
- Ver o código comentado
- Perguntar para quem desenvolveu

---

**Espero que tenha ficado claro!** 😊

Se algo ainda não ficou claro, é só reler a parte específica ou procurar mais informações na documentação técnica.

---

*Documento criado para facilitar o entendimento do projeto para pessoas de todas as idades!*

