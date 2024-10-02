# Sistema de Gerenciamento de Usuários com NestJS

Este projeto é um sistema completo de gerenciamento de usuários, desenvolvido com **NestJS**, implementando autenticação, gerenciamento de permissões, envio de e-mails, e criptografia de senhas. Foi projetado com foco na escalabilidade, segurança e modularidade.

## ⚙️ Tecnologias Utilizadas

- **NestJS**: Framework Node.js para a construção de aplicações escaláveis.
- **Prisma**: ORM utilizado para gerenciar a camada de dados.
- **JWT**: Utilizado para autenticação e gerenciamento de sessões.
- **Bcrypt**: Biblioteca de criptografia para senhas.
- **Nodemailer**: Envio de e-mails para verificação e recuperação de senha.
- **PostgreSQL**: Banco de dados relacional.
- **Docker**: Contêinerização da aplicação para facilitar a distribuição e execução em diferentes ambientes.

## 📁 Arquitetura do Projeto

A arquitetura segue os princípios modulares do **NestJS**, permitindo uma separação clara de responsabilidades. Isso facilita a manutenção e escalabilidade do sistema, possibilitando a adição de novos módulos de forma isolada e sem impacto nos demais componentes.

### Estrutura de Pastas

```bash
src/
│
├── common/               # Utilidades comuns, como hashing de senhas
├── database/             # Configuração do Prisma e conexão com o banco de dados
├── email/                # Módulo de envio de e-mails
├── users/                # Módulo de usuários
│   ├── dto/              # Data Transfer Objects para validação de entradas
│   ├── repository/       # Repositório de usuários utilizando Prisma
│   ├── users.controller.ts # Controlador para as rotas de usuários
│   ├── users.service.ts  # Lógica de negócios e regras de usuários
│   └── users.module.ts   # Configuração e importação dos serviços do módulo
├── main.ts               # Arquivo principal da aplicação
└── ...                   # Outros módulos e arquivos auxiliares
```

## 🚀 Funcionalidades

### 1. **Cadastro de Usuários**
Permite a criação de novos usuários com dados como nome completo, e-mail, telefone e senha. A senha é criptografada com **Bcrypt** antes de ser armazenada no banco de dados.

```bash
POST /users/register
```

- Envia um e-mail de verificação para o usuário com um token JWT, garantindo a segurança do cadastro.

### 2. **Autenticação e Verificação por E-mail**
Após o cadastro, o usuário precisa verificar seu e-mail por meio de um link enviado automaticamente.

```bash
GET /users/verify?token=TOKEN
```

- O sistema valida o token JWT e ativa o usuário no sistema.

### 3. **Recuperação de Senha**
Caso o usuário esqueça sua senha, ele pode solicitar a recuperação. Um e-mail com um link para redefinição é enviado.

```bash
POST /users/sendEmailResetPassword
```

- Após clicar no link do e-mail, o usuário pode redefinir sua senha através da API.

```bash
POST /users/reset-password?token=TOKEN
```

### 4. **Atualização de Perfil de Usuário**
Permite a atualização de informações pessoais como e-mail, nome completo e telefone. Caso o e-mail seja alterado, um novo e-mail de verificação é enviado.

```bash
PATCH /users/updateUser/:id
```

### 5. **Listagem de Usuários Ativos e Deletados**
Permite visualizar todos os usuários cadastrados ou apenas aqueles que foram deletados.

```bash
GET /users
GET /users/deletados
```

- Os usuários deletados podem ser restaurados pelo sistema.

### 6. **Exclusão de Usuários**
Permite a exclusão de usuários, alterando seu status para deletado, sem remover os dados permanentemente do banco.

```bash
DELETE /users/:id
```

## 🛠️ Configuração e Execução do Projeto

### 1. Clone o Repositório

```bash
git clone https://github.com/usuario/nestjs-user-management.git
cd nestjs-user-management
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/nome_db
JWT_SECRET=seu_secret_jwt
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha
```

### 4. Execute o Prisma Migrate

```bash
npx prisma migrate dev
```

### 5. Inicie o Projeto

```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000`.
