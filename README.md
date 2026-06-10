# Regulariza Rural — Sistema de Gestão de Conteúdo (CMS)

Esta é a plataforma institucional do **Projeto Regulariza Rural**, desenvolvida com um **Painel Administrativo (CMS)** integrado que possibilita a atualização dinâmica de todo o conteúdo institucional do portal (notícias, atividades, depoimentos, documentos do repositório, estatísticas de impacto e perguntas frequentes).

O sistema armazena seus dados em um banco relacional **PostgreSQL** através do **Prisma ORM** e gerencia arquivos em um armazenamento escalável compatível com **Amazon S3** (usando **MinIO** localmente).

---

## 1. Visão Geral da Arquitetura

O sistema é dividido em duas partes principais (Frontend e Backend):

```mermaid
graph TD
    Client[Frontend: React + TS + Vite] <-->|HTTP / JSON & Multipart FormData| API[Backend: Express + Node.js]
    API <-->|Prisma Client| DB[(PostgreSQL)]
    API <-->|AWS SDK S3 Client| MinIO[(MinIO Object Storage)]
    API -.->|Fallback de Mídia Local| LocalUploads[Diretório server/uploads]
```

* **Frontend**: Aplicação SPA desenvolvida em **React 18**, **TypeScript**, **Vite** e estilizada com **TailwindCSS**. Possui rotas ocultas de acesso restrito para administradores do portal.
* **Backend**: API REST sob **Node.js** utilizando o framework **Express** em **TypeScript**.
* **Banco de Dados**: Persistência de dados relacionais com **PostgreSQL**, estruturada de forma independente por meio do **Prisma ORM**.
* **Storage de Arquivos**: Suporta armazenamento remoto em nuvem/local compatível com **Amazon S3** (por padrão, via **MinIO**). Caso as credenciais S3 não sejam informadas, o sistema adota um fallback automático que grava arquivos fisicamente na pasta `server/uploads/`.

---

## 2. Estrutura de Diretórios do Projeto

### 2.1 Estrutura do Backend (`server/`)
```
server/
├── prisma/
│   ├── schema.prisma       # Modelagem física das tabelas do banco de dados (Prisma)
│   └── seed.ts             # Script para inserção do admin inicial e dados do portal
├── src/
│   ├── index.ts            # Ponto de entrada (middlewares, CORS, rotas e inicialização)
│   ├── middleware/
│   │   └── auth.ts         # Middleware de interceptação e validação de tokens JWT
│   ├── lib/
│   │   └── storage.ts      # Serviço gerenciador de upload de arquivos (MinIO/S3 ou Fallback Local)
│   └── routes/
│       ├── autenticacao.ts # Rotas de login e recuperação de dados do admin ativo
│       ├── noticias.ts     # Endpoint CRUD de Notícias do Portal
│       ├── atividades.ts   # Endpoint CRUD de Ações/Atividades em Campo
│       ├── depoimentos.ts  # Endpoint CRUD de Depoimentos de Produtores
│       ├── documentos.ts   # Endpoint CRUD do Repositório Institucional de Arquivos
│       ├── estatisticas.ts # Endpoint para atualização de estatísticas de impacto
│       ├── perguntas.ts    # Endpoint CRUD para Dúvidas Frequentes (FAQs)
│       └── upload.ts       # Endpoint de recepção de arquivos de mídia (Multer)
├── uploads/                # Pasta física utilizada no fallback de upload local
├── docker-compose.yml      # Manifesto Docker para execução do MinIO
├── .env.example            # Arquivo de exemplo de variáveis de ambiente
└── package.json            # Dependências e scripts do servidor Node.js
```

### 2.2 Estrutura do Frontend (`src/`)
```
src/
├── contexts/
│   └── AuthContext.tsx     # Provedor do estado de login e autenticação (JWT)
├── lib/
│   └── api/
│       ├── admin.ts        # Métodos de comunicação restritos do CMS (Authorization Header)
│       ├── public.ts       # Métodos de comunicação para páginas públicas do portal
│       ├── types.ts        # Interfaces tipadas em TypeScript dos dados (em português)
│       └── client.ts       # Instância centralizada e configuração de requisições fetch
├── pages/
│   ├── admin/
│   │   ├── Acesso.tsx      # Tela de login administrativo protegida (Glassmorphism)
│   │   ├── Painel.tsx      # Dashboard CMS contendo a navegação do painel
│   │   └── modules/
│   │       ├── GerenciadorNoticias.tsx     # Módulo CRUD de Notícias
│   │       ├── GerenciadorAtividades.tsx   # Módulo CRUD de Ações em Campo
│   │       ├── GerenciadorDocumentos.tsx    # Módulo CRUD do Repositório de Documentos
│   │       ├── GerenciadorDepoimentos.tsx   # Módulo CRUD de Depoimentos
│   │       ├── GerenciadorEstatisticas.tsx  # Módulo de edição das estatísticas do painel
│   │       ├── GerenciadorFaq.tsx          # Módulo CRUD de FAQ
│   │       └── compartilhado.tsx            # Componentes modais e utilitários de upload comuns
│   ├── Inicio.tsx          # Home page do portal institucional (dinâmica)
│   ├── Noticias.tsx        # Página pública de Notícias (com paginação e filtros)
│   ├── Atividades.tsx      # Página pública de frentes de trabalho (com paginação e filtros)
│   ├── Repositorio.tsx     # Repositório de downloads e links institucionais (dinâmico)
│   ├── Resultados.tsx      # Painel estatístico e sessão de FAQ (dinâmico)
│   └── Projeto.tsx         # Página estática institucional do projeto
├── App.tsx                 # Rotas globais do portal com sistema de <ProtectedRoute>
└── index.css               # Folha de estilo de design do portal
```

---

## 3. Banco de Dados (Dicionário de Modelos em Português)

O banco de dados relacional é estruturado com tabelas que utilizam nomenclatura totalmente em português (Brasil):

### 3.1 Modelo `Usuario` (Tabela `usuarios`)
Armazena dados de acesso dos administradores do CMS.
* `id` (`Int`, PK, Autoincremento)
* `email` (`String`, Unique)
* `senhaHash` (`String`, Coluna: `senha_hash`)
* `nome` (`String`, Opcional)
* `criadoEm` (`DateTime`, Default: `now()`, Coluna: `criado_em`)

### 3.2 Modelo `Noticia` (Tabela `noticias`)
Registros de publicações e informativos do portal.
* `id` (`Int`, PK, Autoincremento)
* `titulo` (`String`, VarChar(255))
* `resumo` (`String`, Text, Opcional)
* `conteudo` (`String`, Text, Opcional)
* `categoria` (`String`, VarChar(100), Opcional)
* `corCategoria` (`String`, VarChar(50), Opcional, Coluna: `cor_categoria`)
* `urlImagem` (`String`, VarChar(500), Opcional, Coluna: `url_imagem`)
* `criadoEm` (`DateTime`, Default: `now()`, Coluna: `criado_em`)

### 3.3 Modelo `Atividade` (Tabela `atividades`)
Frentes de atuação do projeto.
* `id` (`Int`, PK, Autoincremento)
* `titulo` (`String`, VarChar(255))
* `descricao` (`String`, Text, Opcional)
* `insignias` (`String[]`) - Etiquetas / Badges (ex: `["Recuperação", "Mata Atlântica"]`)
* `valorAlvo` (`String`, VarChar(100), Opcional, Coluna: `valor_alvo`) - Métrica da atividade (ex: `85`)
* `rotuloAlvo` (`String`, VarChar(100), Opcional, Coluna: `rotulo_alvo`) - Rótulo da métrica (ex: `Famílias atendidas`)
* `objetivo` (`String`, VarChar(255), Opcional)
* `urlImagem` (`String`, VarChar(500), Opcional, Coluna: `url_imagem`)
* `criadoEm` (`DateTime`, Default: `now()`, Coluna: `criado_em`)

### 3.4 Modelo `Depoimento` (Tabela `depoimentos`)
Depoimentos de parceiros técnicos e agricultores rurais.
* `id` (`Int`, PK, Autoincremento)
* `citacao` (`String`, Text, Opcional)
* `nome` (`String`, VarChar(100), Opcional)
* `cargo` (`String`, VarChar(100), Opcional)
* `urlAvatar` (`String`, VarChar(500), Opcional, Coluna: `url_avatar`)
* `criadoEm` (`DateTime`, Default: `now()`, Coluna: `criado_em`)

### 3.5 Modelo `DocumentoRepositorio` (Tabela `documentos_repositorio`)
Manuais, formulários e vídeos no repositório de arquivos.
* `id` (`Int`, PK, Autoincremento)
* `titulo` (`String`, VarChar(255))
* `descricao` (`String`, Text, Opcional)
* `tipoIcone` (`String`, VarChar(50), Opcional, Coluna: `tipo_icone`) - Ícone representativo (`pdf`, `zip`, `video`, etc.)
* `tamanhoArquivo` (`String`, VarChar(50), Opcional, Coluna: `tamanho_arquivo`) (ex: `2.4 MB`)
* `tipoDocumento` (`String`, VarChar(50), Opcional, Coluna: `tipo_documento`) (`DOWNLOAD`, `LINK`, `WATCH`)
* `urlArquivo` (`String`, VarChar(500), Opcional, Coluna: `url_arquivo`)
* `criadoEm` (`DateTime`, Default: `now()`, Coluna: `criado_em`)

### 3.6 Modelo `EstatisticaDashboard` (Tabela `estatisticas_dashboard`)
Dados numéricos expostos no portal e no dashboard.
* `id` (`Int`, PK, Autoincremento)
* `nomeChave` (`String`, Unique, VarChar(100), Coluna: `nome_chave`)
* `valor` (`String`, VarChar(50), Opcional)
* `unidade` (`String`, VarChar(20), Opcional)
* `classeCor` (`String`, VarChar(50), Opcional, Coluna: `classe_cor`)
* `updatedAt` (`DateTime`, AutoUpdate, Coluna: `atualizado_em`)

### 3.7 Modelo `PerguntaFrequente` (Tabela `perguntas_frequentes`)
Dúvidas frequentes do portal (FAQ).
* `id` (`Int`, PK, Autoincremento)
* `pergunta` (`String`, Text, Opcional)
* `resposta` (`String`, Text, Opcional)
* `ordem` (`Int`, Opcional)

---

## 4. Endpoints da API

Todas as rotas estão documentadas abaixo:

| Método | Endpoint | Proteção | Descrição | Request Body / Payload |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/autenticacao/login` | Livre | Autentica o administrador | `{ email, password }` |
| **GET** | `/api/autenticacao/me` | JWT | Retorna o usuário logado atualmente | Nenhuma |
| **GET** | `/api/noticias` | Livre | Lista as notícias paginadas | Query: `?page=1&limit=9` |
| **GET** | `/api/noticias/:id` | Livre | Retorna uma única notícia | Nenhuma |
| **POST** | `/api/noticias` | JWT | Cria uma nova notícia | `{ titulo, resumo, conteudo, categoria, corCategoria, urlImagem }` |
| **PUT** | `/api/noticias/:id` | JWT | Edita uma notícia existente | Parcial de `{ titulo, resumo, ... }` |
| **DELETE** | `/api/noticias/:id` | JWT | Exclui uma notícia | Nenhuma |
| **GET** | `/api/atividades` | Livre | Lista frentes de trabalho paginadas | Query: `?page=1&limit=2` |
| **POST** | `/api/atividades` | JWT | Cria uma nova atividade | `{ titulo, descricao, insignias[], valorAlvo, rotuloAlvo, objetivo, urlImagem }` |
| **PUT** | `/api/atividades/:id` | JWT | Edita uma atividade existente | Parcial de `{ titulo, descricao, ... }` |
| **DELETE** | `/api/atividades/:id` | JWT | Exclui uma atividade | Nenhuma |
| **GET** | `/api/depoimentos` | Livre | Lista todos os depoimentos do campo | Nenhuma |
| **POST** | `/api/depoimentos` | JWT | Cria um novo depoimento | `{ citacao, nome, cargo, urlAvatar }` |
| **PUT** | `/api/depoimentos/:id` | JWT | Edita um depoimento existente | Parcial de `{ citacao, nome, ... }` |
| **DELETE** | `/api/depoimentos/:id` | JWT | Exclui um depoimento | Nenhuma |
| **GET** | `/api/documentos` | Livre | Lista documentos do repositório | Nenhuma |
| **POST** | `/api/documentos` | JWT | Cria um documento no repositório | `{ titulo, descricao, tipoIcone, tamanhoArquivo, tipoDocumento, urlArquivo }` |
| **PUT** | `/api/documentos/:id` | JWT | Edita um documento existente | Parcial de `{ titulo, descricao, ... }` |
| **DELETE** | `/api/documentos/:id` | JWT | Exclui um documento | Nenhuma |
| **GET** | `/api/estatisticas` | Livre | Lista todas as estatísticas | Nenhuma |
| **PUT** | `/api/estatisticas/:nomeChave`| JWT | Atualiza métrica específica por chave | `{ valor, unidade }` |
| **GET** | `/api/perguntas` | Livre | Lista todas as FAQs do portal | Nenhuma |
| **POST** | `/api/perguntas` | JWT | Cria uma nova pergunta FAQ | `{ pergunta, resposta, ordem }` |
| **PUT** | `/api/perguntas/:id` | JWT | Edita uma FAQ existente | Parcial de `{ pergunta, resposta, ordem }` |
| **DELETE** | `/api/perguntas/:id` | JWT | Exclui uma FAQ | Nenhuma |
| **POST** | `/api/upload` | JWT | Realiza upload de mídia física | Multipart FormData: `file` |
| **GET** | `/api/health` | Livre | Rota de verificação do status da API | Nenhuma |

---

## 5. Configurando o Ambiente Local

### 5.1 Requisitos Mínimos
* **Node.js** v18+
* **PostgreSQL** ativo localmente
* **Docker / Docker Compose** (opcional, para rodar o MinIO)

### 5.2 Configurando Variáveis de Ambiente (`.env`)

#### No Servidor (`server/.env`):
Crie um arquivo `.env` dentro do diretório `server/` a partir de `.env.example`:
```env
# URL de conexão com o PostgreSQL
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/regulariza_rural?schema=public"

# Configurações do JWT
JWT_SECRET="insira_aqui_uma_chave_secreta_longa_e_aleatoria_para_assinatura_de_tokens"
JWT_EXPIRES_IN="7d"

# Porta do Servidor Express
PORT=3001

# Fallback de URL estática de uploads
UPLOAD_BASE_URL="http://localhost:3001"
NODE_ENV="development"

# Object Storage S3/MinIO
AWS_ACCESS_KEY_ID="minioadmin"
AWS_SECRET_ACCESS_KEY="minioadmin"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="meu-bucket-local"
AWS_ENDPOINT="http://localhost:9000"
```

#### No Frontend (raiz do projeto):
Crie um arquivo `.env` na pasta raiz do projeto:
```env
VITE_API_URL="http://localhost:3001/api"
```

---

## 6. Instruções de Execução

### Passo 1: Iniciar os Serviços Locais
1. Certifique-se de que o PostgreSQL está rodando.
2. Inicie o contêiner do MinIO local:
   ```bash
   cd server
   docker-compose up -d
   ```
3. Acesse a Web Console do MinIO em `http://localhost:9001` (login: `minioadmin` / `minioadmin`) e certifique-se de criar um bucket chamado `meu-bucket-local` com permissões de acesso públicas (ou conforme as políticas do S3) para servir os arquivos sem bloqueios.

### Passo 2: Inicializar o Banco de Dados
Ainda no diretório `server/`:
```bash
# Instalar dependências do backend
npm install

# Sincronizar o schema com o PostgreSQL
npx prisma db push

# Popular o banco de dados (Cria o administrador padrão e dados institucionais)
npm run db:seed
```

### Passo 3: Executar a Aplicação em Desenvolvimento

Abra dois terminais diferentes para rodar os servidores dev:

**Terminal 1 — Backend (`server/`):**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend (Raiz do projeto):**
```bash
npm install
npm run dev
```

O portal institucional estará disponível em `http://localhost:5173`.

---

## 7. Credenciais Padrão e Acesso Administrativo (CMS)

Como medida de segurança e conveniência do design, **não existem links públicos no portal** para acesso administrativo. Você deve acessar diretamente o endereço oculto do painel:

> [!IMPORTANT]
> **URL do Painel**: [http://localhost:5173/rr-gestao/acesso](http://localhost:5173/rr-gestao/acesso)
> **E-mail**: `admin@regularizarural.org`
> **Senha**: `admin123`
