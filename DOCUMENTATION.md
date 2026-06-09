# Documentação Técnica e Operacional — Regulariza Rural CMS

Este documento fornece um guia técnico detalhado da arquitetura, estrutura de dados, fluxos de autenticação, APIs do Backend e componentes do Frontend que compõem o sistema **Regulariza Rural** com o seu **Painel Administrativo (CMS)**.

O objetivo do CMS é permitir que administradores atualizem de forma dinâmica o conteúdo institucional do portal (notícias, atividades, depoimentos, documentos do repositório, estatísticas e FAQs), substituindo os dados mockados anteriores por dados armazenados em um banco de dados relacional PostgreSQL.

---

## 1. Visão Geral da Arquitetura

O sistema segue uma arquitetura cliente-servidor padrão com separação total entre Frontend e Backend:

```mermaid
graph TD
    Client[Frontend React + TS + Vite] <-->|HTTPS / JSON & FormData| API[Backend Express + Node.js]
    API <-->|Prisma ORM| DB[(Banco PostgreSQL)]
    API <-->|Leitura/Escrita Local| Uploads[Diretório server/uploads]
```

- **Frontend**: Desenvolvido em **React**, **TypeScript**, **Vite** e **TailwindCSS**. Interface altamente dinâmica e responsiva. O acesso ao CMS é restrito a rotas ocultas protegidas por contexto de autenticação baseada em tokens.
- **Backend**: API REST desenvolvida em **Node.js**, **Express**, **TypeScript** e **Prisma ORM**.
- **Banco de Dados**: **PostgreSQL** para persistência dos dados relacionais.
- **Storage de Arquivos**: Armazenamento local no servidor (`server/uploads/`) para as mídias, imagens e documentos enviados via upload.

---

## 2. Estrutura de Diretórios e Arquivos

### 2.1 Backend (`server/`)
```
server/
├── prisma/
│   ├── schema.prisma       # Modelagem das tabelas do banco de dados (Prisma)
│   └── seed.ts             # Script de população inicial do banco (mock data + admin)
├── src/
│   ├── index.ts            # Ponto de entrada do servidor (configuração de middlewares e rotas)
│   ├── middleware/
│   │   └── auth.ts         # Middleware para verificação e decodificação do JWT
│   └── routes/
│       ├── auth.ts         # Rotas de login e dados do usuário ativo
│       ├── news.ts         # CRUD de Notícias (público e privado)
│       ├── activities.ts   # CRUD de Atividades (público e privado)
│       ├── testimonials.ts # CRUD de Depoimentos (público e privado)
│       ├── documents.ts    # CRUD de Documentos de Repositório (público e privado)
│       ├── stats.ts        # Leitura e Escrita de Estatísticas do Painel
│       ├── faqs.ts         # CRUD de Perguntas Frequentes (FAQs)
│       └── upload.ts       # Endpoint para upload de arquivos usando Multer
├── uploads/                # Diretório físico que armazena os arquivos carregados
├── .env                  # Variáveis de ambiente locais (não versionado)
├── .env.example          # Exemplo de configuração de variáveis de ambiente
├── package.json            # Dependências e scripts do Node.js
└── tsconfig.json           # Configuração de compilação do TypeScript
```

### 2.2 Frontend (`src/`)
```
src/
├── contexts/
│   └── AuthContext.tsx     # Provedor do estado de autenticação (JWT no localStorage)
├── lib/
│   └── api.ts              # Cliente HTTP centralizado e interfaces de tipos do TypeScript
├── pages/
│   ├── admin/
│   │   ├── Dashboard.tsx   # Layout do Painel Administrativo com abas de gestão
│   │   ├── Login.tsx       # Tela de login administrativa com efeito Glassmorphism
│   │   └── modules/
│   │       ├── ActivitiesManager.tsx  # Componente CRUD de Atividades do projeto
│   │       ├── DocumentsManager.tsx   # Componente CRUD do Repositório de Documentos
│   │       ├── FaqManager.tsx         # Componente CRUD de FAQs
│   │       ├── NewsManager.tsx        # Componente CRUD de Notícias do Portal
│   │       ├── StatsManager.tsx       # Componente de edição das estatísticas do painel
│   │       ├── TestimonialsManager.tsx# Componente CRUD dos Depoimentos
│   │       └── shared.tsx             # Componentes modais e utilitários de upload compartilhados
│   ├── Home.tsx            # Página Inicial do Portal (dinâmica via API)
│   ├── News.tsx            # Página de Notícias (dinâmica via API, com paginação)
│   ├── Activities.tsx      # Página de Atividades (dinâmica via API, com paginação)
│   ├── Repository.tsx      # Página de Repositório de Documentos (dinâmica via API)
│   ├── Results.tsx         # Página de Resultados (consome FAQ e estatísticas dinamicamente)
│   └── Project.tsx         # Página sobre o Projeto
├── App.tsx                 # Rotas do React Router Dom (públicas e escondidas)
├── main.tsx                # Inicializador do React
└── index.css               # Folha de estilos global (inclui TailwindCSS)
```

---

## 3. Banco de Dados (PostgreSQL + Prisma)

O banco de dados do projeto conta com **7 tabelas** mapeadas no arquivo `schema.prisma`:

### 3.1 Dicionário de Dados (Modelos)

#### Tabela `users` (`User`)
Armazena as credenciais dos administradores autorizados a gerenciar o CMS.
- `id` (Int, PK, Autoincremento): Identificador único do usuário.
- `email` (String, Unique): E-mail de acesso.
- `password_hash` (String): Senha criptografada via `bcryptjs`.
- `name` (String, Opcional): Nome de exibição do usuário.
- `created_at` (DateTime, Default: `now()`): Data de cadastro.

#### Tabela `news` (`News`)
Armazena as publicações de notícias do portal.
- `id` (Int, PK, Autoincremento): Identificador único.
- `title` (String, VarChar(255), Obrigatório): Título da notícia.
- `excerpt` (String, Text, Opcional): Resumo ou introdução curta da notícia.
- `content` (String, Text, Opcional): Conteúdo completo em Markdown/HTML/Texto.
- `category` (String, VarChar(100), Opcional): Categoria da notícia (ex: "Edital", "Evento").
- `category_color` (String, VarChar(50), Opcional): Cor da tag no frontend (ex: `green`, `blue`).
- `image_url` (String, VarChar(500), Opcional): URL da imagem de capa.
- `created_at` (DateTime, Default: `now()`): Data de publicação.

#### Tabela `activities` (`Activity`)
Armazena as ações e metas executadas pelo projeto.
- `id` (Int, PK, Autoincremento): Identificador único.
- `title` (String, VarChar(255), Obrigatório): Nome da atividade.
- `description` (String, Text, Opcional): Detalhamento do que é feito.
- `badges` (String[], Array de Strings): Etiquetas ou tags rápidas (ex: ["Capacitação", "Regularização"]).
- `target_value` (String, VarChar(100), Opcional): O valor numérico da meta (ex: "800", "100%").
- `target_label` (String, VarChar(100), Opcional): O texto explicativo da meta (ex: "Famílias", "Área mapeada").
- `objective` (String, VarChar(255), Opcional): Objetivo principal da atividade.
- `image_url` (String, VarChar(500), Opcional): Imagem ilustrativa da atividade.
- `created_at` (DateTime, Default: `now()`): Data de criação.

#### Tabela `testimonials` (`Testimonial`)
Depoimentos dos beneficiários e parceiros do projeto.
- `id` (Int, PK, Autoincremento): Identificador único.
- `quote` (String, Text, Opcional): O depoimento em si.
- `name` (String, VarChar(100), Opcional): Nome da pessoa.
- `role` (String, VarChar(100), Opcional): Cargo ou descrição (ex: "Agricultor Familiar - Gleba X").
- `avatar_url` (String, VarChar(500), Opcional): URL da foto de perfil.
- `created_at` (DateTime, Default: `now()`): Data de criação.

#### Tabela `repository_documents` (`RepositoryDocument`)
Documentos e arquivos disponíveis para download no Repositório.
- `id` (Int, PK, Autoincremento): Identificador único.
- `title` (String, VarChar(255), Obrigatório): Título do documento.
- `description` (String, Text, Opcional): Resumo do documento.
- `icon_type` (String, VarChar(50), Opcional): Ícone que representa o arquivo no front (ex: `pdf`, `doc`, `sheet`).
- `file_size` (String, VarChar(50), Opcional): Tamanho do arquivo formatado (ex: "1.2 MB").
- `doc_type` (String, VarChar(50), Opcional): Tipo ou categoria (ex: "Cartilha", "Legislação", "Modelo").
- `file_url` (String, VarChar(500), Opcional): Link direto para download do arquivo.
- `created_at` (DateTime, Default: `now()`): Data de inclusão.

#### Tabela `dashboard_stats` (`DashboardStat`)
Dados numéricos globais exibidos na página de Resultados e no portal.
- `id` (Int, PK, Autoincremento): Identificador único.
- `key_name` (String, VarChar(100), Unique): Chave identificadora (ex: `propriedades`, `capacitados`, `familias`, `mapas`).
- `value` (String, VarChar(50), Opcional): O valor numérico/texto (ex: "1.200", "850").
- `unit` (String, VarChar(20), Opcional): A unidade de medida (ex: "un", "famílias", "%").
- `color_class` (String, VarChar(50), Opcional): Classe CSS de cor (ex: `green`, `emerald`, `indigo`).
- `updated_at` (DateTime, AutoUpdate): Data da última atualização da métrica.

#### Tabela `faqs` (`Faq`)
Perguntas e respostas frequentes exibidas no portal.
- `id` (Int, PK, Autoincremento): Identificador único.
- `question` (String, Text, Opcional): A pergunta.
- `answer` (String, Text, Opcional): A resposta detalhada.
- `order_num` (Int, Opcional): Número de ordem para ordenação personalizada das perguntas.

---

## 4. Backend (API REST Node.js/Express)

O backend expõe uma API JSON estruturada que aceita requisições CORS de origens permitidas (localhost:5173 / localhost:3000).

### 4.1 Autenticação e Segurança

A autenticação é feita via **JSON Web Tokens (JWT)**:
1. O administrador envia as credenciais no endpoint `/api/auth/login`.
2. O servidor valida a senha usando `bcryptjs` e assina um token contendo `{ userId, email }`.
3. O token retornado expira por padrão em **7 dias** (configurado pela variável `JWT_EXPIRES_IN`).
4. Para acessar rotas protegidas (todas as de criação, edição, deleção e upload), o cliente deve enviar o cabeçalho HTTP:
   `Authorization: Bearer <SEU_TOKEN_JWT>`
5. O middleware `auth.ts` intercepta e valida a requisição, anexando `req.userId` ao objeto Request.

### 4.2 Endpoints da API

A tabela abaixo descreve todos os endpoints implementados:

| Método | Endpoint | Autenticação | Descrição | Request Body | Response (Sucesso) |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Não | Autentica o administrador | `{ email, password }` | `{ token, user: { id, email, name } }` |
| **GET** | `/api/auth/me` | Sim | Obtém informações do usuário ativo | Nenhuma | `{ id, email, name, createdAt }` |
| **GET** | `/api/news` | Não | Lista notícias paginadas | Query: `?page=1&limit=9&category=x` | `{ items: News[], total, page, totalPages }` |
| **GET** | `/api/news/:id` | Não | Detalha uma única notícia | Nenhuma | `{ id, title, excerpt, content, ... }` |
| **POST** | `/api/news` | Sim | Cria nova notícia | `{ title, excerpt, content, category, categoryColor, imageUrl }` | `{ id, title, excerpt, ... }` (Status 201) |
| **PUT** | `/api/news/:id` | Sim | Edita notícia existente | Parcial do objeto `{ title, excerpt, ... }` | `{ id, title, excerpt, ... }` (Atualizado) |
| **DELETE** | `/api/news/:id` | Sim | Remove uma notícia | Nenhuma | `{ message: "Notícia removida com sucesso" }` |
| **GET** | `/api/activities` | Não | Lista atividades paginadas | Query: `?page=1&limit=10` | `{ items: Activity[], total, page, totalPages }` |
| **POST** | `/api/activities` | Sim | Cria nova atividade | `{ title, description, badges[], targetValue, targetLabel, objective, imageUrl }` | `{ id, title, description, ... }` (Status 201) |
| **PUT** | `/api/activities/:id` | Sim | Edita atividade | Parcial do objeto `{ title, ... }` | `{ id, title, ... }` |
| **DELETE** | `/api/activities/:id` | Sim | Remove atividade | Nenhuma | `{ message: "Atividade removida com sucesso" }` |
| **GET** | `/api/testimonials` | Não | Lista depoimentos (todos) | Nenhuma | `Testimonial[]` |
| **POST** | `/api/testimonials` | Sim | Cria depoimento | `{ quote, name, role, avatarUrl }` | `{ id, quote, name, role, avatarUrl, ... }` |
| **PUT** | `/api/testimonials/:id` | Sim | Edita depoimento | Parcial do depoimento | `{ id, quote, ... }` |
| **DELETE** | `/api/testimonials/:id` | Sim | Remove depoimento | Nenhuma | `{ message: "Depoimento removido com sucesso" }` |
| **GET** | `/api/documents` | Não | Lista documentos de repositório | Nenhuma | `RepositoryDocument[]` |
| **POST** | `/api/documents` | Sim | Cria documento no repositório | `{ title, description, iconType, fileSize, docType, fileUrl }` | `{ id, title, ... }` |
| **PUT** | `/api/documents/:id` | Sim | Edita documento | Parcial do documento | `{ id, title, ... }` |
| **DELETE** | `/api/documents/:id` | Sim | Remove documento | Nenhuma | `{ message: "Documento removido com sucesso" }` |
| **GET** | `/api/stats` | Não | Lista estatísticas globais | Nenhuma | `DashboardStat[]` |
| **PUT** | `/api/stats/:keyName` | Sim | Edita métrica específica por chave | `{ value, unit, colorClass }` | `{ id, keyName, value, unit, colorClass }` |
| **GET** | `/api/faqs` | Não | Lista perguntas frequentes | Nenhuma | `Faq[]` |
| **POST** | `/api/faqs` | Sim | Cria pergunta FAQ | `{ question, answer, orderNum }` | `{ id, question, answer, orderNum }` |
| **PUT** | `/api/faqs/:id` | Sim | Edita pergunta FAQ | Parcial do FAQ | `{ id, question, answer, orderNum }` |
| **DELETE** | `/api/faqs/:id` | Sim | Remove pergunta FAQ | Nenhuma | `{ message: "Faq removido com sucesso" }` |
| **POST** | `/api/upload` | Sim | Realiza upload de arquivos físicos | Payload Multipart/Form-Data: `file` | `{ url, filename, originalName, size, mimetype }` |
| **GET** | `/api/health` | Não | Verifica se a API está online | Nenhuma | `{ status: "ok", timestamp }` |

### 4.3 Mecanismo de Upload de Arquivos

O upload é implementado com a biblioteca `multer` em `server/src/routes/upload.ts`:
- **Caminho Físico**: Salvo em `server/uploads/` com um sufixo temporal único para evitar colisões (ex: `1717462000000-848293742.pdf`).
- **Validação de Tamanho**: Limite configurado de **50 MB** por arquivo.
- **Formatos Permitidos (MIME-Type check)**:
  - Imagens: `jpg`, `jpeg`, `png`, `webp`, `gif`
  - Documentos: `pdf`, `doc`, `docx`
  - Planilhas e Arquivos compactados: `zip`, `doc`, `docx`, `xls`, `xlsx`
  - Vídeos: `mp4`, `webm`
- **URL Exposta**: Os arquivos são expostos pelo middleware estático do Express em `/uploads/*`. A URL de retorno é construída dinamicamente usando a variável `UPLOAD_BASE_URL` ou o fallback `http://localhost:<PORT>/uploads/<nome_arquivo>`.

---

## 5. Frontend (React + TS + Vite)

O frontend interage com a API de forma assíncrona, usando estados globais para o fluxo administrativo e buscando conteúdos da API nas páginas públicas.

### 5.1 Sistema de Rotas Escondidas e Segurança do CMS

Para evitar acesso indevido e manter a discrição do painel administrativo, **não há links ou botões de login públicos no cabeçalho ou rodapé do portal institucional**. As rotas do CMS são acessadas apenas por URLs ocultas:

1. **Tela de Login**: `http://localhost:5173/rr-gestao/acesso`
2. **Painel Administrativo**: `http://localhost:5173/rr-gestao/painel`

A lógica de proteção é implementada no `App.tsx` com o componente `<ProtectedRoute>`:
- Se o usuário tentar acessar `/rr-gestao/painel` sem estar autenticado, ele é redirecionado instantaneamente para `/rr-gestao/acesso`.
- Se o usuário estiver autenticado e tentar acessar `/rr-gestao/acesso`, a página de login pode redirecioná-lo diretamente para `/rr-gestao/painel`.

### 5.2 Fluxo de Autenticação (`AuthContext.tsx`)

O `AuthContext.tsx` gerencia o ciclo de vida do login:
- Armazena o token JWT sob a chave `rr_admin_token` no `localStorage`.
- No carregamento inicial, faz uma requisição para `/api/auth/me` para checar se o token armazenado ainda é válido.
- Expõe a função `login(email, password)` e `logout()`.
- Expõe os estados `isAuthenticated`, `user` (dados do admin) e `isLoading` (impede flashes de tela durante a checagem inicial do token).

### 5.3 Cliente HTTP centralizado (`src/lib/api.ts`)

A comunicação é centralizada no arquivo `api.ts`, contendo dois objetos principais:
- **`api`**: Contém as chamadas públicas para os visitantes do site (ex: `getNews`, `getActivities`, `getTestimonials`, `getDocuments`, `getStats`, `getFaqs`).
- **`adminApi`**: Contém as chamadas restritas que requerem autorização (ex: `createNews`, `updateNews`, `deleteNews`, `uploadFile`, etc.). Todas essas chamadas adicionam automaticamente o header `Authorization: Bearer <token>` caso ele esteja no `localStorage`.

### 5.4 Organização dos Módulos do CMS (Dashboard)

A página administrativa `Dashboard.tsx` fornece uma barra lateral de navegação e renderiza os seguintes painéis gerenciadores (`src/pages/admin/modules/`):

1. **NewsManager.tsx (Gestão de Notícias)**
   - Exibe a lista de notícias paginadas.
   - Formulário para criação e edição com campos de título, categoria, cor da categoria, resumo (excerpt), conteúdo e imagem de capa.
   - Upload de imagens integrado.
2. **ActivitiesManager.tsx (Gestão de Atividades)**
   - Permite controlar as atividades, objetivos e metas do projeto.
   - Suporta a adição de múltiplos badges (etiquetas) através de um seletor visual dinâmico.
3. **DocumentsManager.tsx (Gestão do Repositório)**
   - Upload direto de arquivos (documentos legislativos, cartilhas, modelos de formulários).
   - Preenche automaticamente o tamanho do arquivo (`fileSize`) ao enviar.
   - Permite escolher o ícone representativo (`pdf`, `doc`, `sheet`, `image`, `zip`).
4. **TestimonialsManager.tsx (Gestão de Depoimentos)**
   - Permite gerenciar a galeria de depoimentos dos produtores rurais e parceiros técnicos.
   - Permite o upload do avatar do depoente.
5. **StatsManager.tsx (Painel de Métricas e Resultados)**
   - Permite gerenciar as quatro principais métricas estáticas do portal de forma simples e direta (ex: editar o número de propriedades cadastradas ou famílias atendidas).
6. **FaqManager.tsx (Gestão de Dúvidas Frequentes)**
   - Interface de controle da seção de perguntas e respostas frequentes do site, incluindo controle de peso de ordenação.
7. **Componentes Compartilhados (`shared.tsx`)**
   - **`FileUpload`**: Caixa de arrastar-e-soltar para upload de arquivos com progresso em porcentagem, integrada com a rota da API.
   - **`Modal`**: Janela flutuante para formulários de criação/edição.
   - **`ConfirmDelete`**: Confirmação visual para exclusão segura de registros.
   - **`Field`**: Componente de input padronizado para manter a consistência de estilo.

---

## 6. Configuração do Ambiente e Instalação

### 6.1 Variáveis de Ambiente

#### Backend (`server/.env`)
Crie o arquivo e defina as variáveis:
```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_BANCO?schema=public"
JWT_SECRET="uma_senha_secreta_longa_para_gerar_os_tokens"
JWT_EXPIRES_IN="7d"
PORT=3001
UPLOAD_BASE_URL="http://localhost:3001"
NODE_ENV="development"
```

#### Frontend (`.env` na raiz do projeto)
O Vite usa o prefixo `VITE_` para carregar as variáveis no build frontend:
```env
VITE_API_URL="http://localhost:3001/api"
```

### 6.2 Comandos Rápidos de Execução

#### Inicialização do Banco de Dados
Com o PostgreSQL rodando localmente:
```bash
# 1. Entre no diretório do servidor
cd server

# 2. Instale as dependências do backend
npm install

# 3. Rode as migrations para criar as tabelas no PostgreSQL
npx prisma migrate dev --name init

# 4. Rode a Seed para criar o usuário administrador padrão e dados de exemplo
npm run db:seed
```

#### Executar em Desenvolvimento (Duas Abas do Terminal)

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
*(Executado por padrão em `http://localhost:3001`)*

**Terminal 2 — Frontend:**
```bash
npm install
npm run dev
```
*(Executado por padrão em `http://localhost:5173`)*

---

## 7. Credenciais Padrão de Acesso ao Painel

Após rodar o script de seed (`npm run db:seed`), utilize as seguintes credenciais para acessar o painel:

> [!IMPORTANT]
> **URL Oculta do CMS**: [http://localhost:5173/rr-gestao/acesso](http://localhost:5173/rr-gestao/acesso)
> **E-mail**: `admin@regularizarural.org`
> **Senha**: `admin123`
>
> Recomenda-se trocar a senha do administrador ou criar novos usuários diretamente na tabela `users` do banco de dados em ambiente produtivo.

---

## 8. Guia para Adicionar Novas Seções Dinâmicas

Se precisar criar uma nova funcionalidade controlada pelo CMS (ex: "Parceiros" ou "Membros da Equipe"):

### Passo 1: Atualizar o Banco de Dados
No arquivo `server/prisma/schema.prisma`, defina o novo modelo:
```prisma
model Partner {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(150)
  logoUrl   String?  @db.VarChar(500) @map("logo_url")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("partners")
}
```
Em seguida, execute no terminal do servidor:
```bash
npx prisma migrate dev --name add_partners
```

### Passo 2: Criar as Rotas da API
Crie `server/src/routes/partners.ts` e exporte o roteador Express com os métodos `GET`, `POST`, `PUT` e `DELETE` (protegendo os métodos modificadores com o middleware `requireAuth`).
Importe e registre a rota no `server/src/index.ts`:
```typescript
import partnerRoutes from './routes/partners';
app.use('/api/partners', partnerRoutes);
```

### Passo 3: Adicionar a Integração no Frontend
No arquivo `src/lib/api.ts`:
1. Defina a interface `Partner`.
2. Adicione `getPartners` ao objeto `api`.
3. Adicione `createPartner`, `updatePartner` e `deletePartner` ao objeto `adminApi`.

### Passo 4: Criar a Tela Gerenciadora no CMS
Crie um novo módulo em `src/pages/admin/modules/PartnersManager.tsx` usando os modais e helpers de `shared.tsx`. Importe e incorpore no menu lateral de `Dashboard.tsx`.
