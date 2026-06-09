# Regulariza Rural — Configuração do Servidor Backend

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+ instalado e rodando

## Passo a Passo

### 1. Configurar Variáveis de Ambiente

```bash
cd server
copy .env.example .env
```

Edite o arquivo `.env` gerado com suas credenciais:

```env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/regulariza_rural"
JWT_SECRET="uma_chave_longa_e_aleatoria_aqui"
JWT_EXPIRES_IN="7d"
PORT=3001
UPLOAD_BASE_URL="http://localhost:3001"
NODE_ENV="development"
```

### 2. Criar o Banco de Dados no PostgreSQL

Conecte no psql ou pgAdmin e execute:

```sql
CREATE DATABASE regulariza_rural;
```

### 3. Gerar o cliente Prisma e aplicar migrations

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Popular o banco com dados iniciais

```bash
npm run db:seed
```

Isso cria:
- **Usuário admin**: `admin@regularizarural.org` / senha: `admin123`
- Todas as notícias, atividades, depoimentos e documentos

### 5. Iniciar o servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

---

## Iniciar o Frontend (em outro terminal)

```bash
cd ..   # voltar para project/
npm run dev
```

O portal estará em `http://localhost:5173`

---

## Acessar o Painel Administrativo

Acesse: `http://localhost:5173/rr-gestao/acesso`

- **E-mail**: `admin@regularizarural.org`
- **Senha**: `admin123`

---

## Estrutura de Pastas

```
server/
├── prisma/
│   ├── schema.prisma     ← Modelos do banco
│   └── seed.ts           ← Dados iniciais
├── src/
│   ├── index.ts          ← Entry point Express
│   ├── middleware/
│   │   └── auth.ts       ← Validação JWT
│   └── routes/
│       ├── auth.ts       ← Login / /me
│       ├── news.ts       ← CRUD Notícias
│       ├── activities.ts ← CRUD Atividades
│       ├── testimonials.ts
│       ├── documents.ts
│       ├── stats.ts
│       ├── faqs.ts
│       └── upload.ts     ← Upload de arquivos
├── uploads/              ← Arquivos enviados (criado automaticamente)
├── .env                  ← Suas credenciais (não versionar)
└── .env.example          ← Template
```

## Endpoints da API

| Método | Rota | Proteção | Descrição |
|--------|------|----------|-----------|
| POST | /api/auth/login | Público | Login, retorna JWT |
| GET | /api/auth/me | JWT | Dados do usuário |
| GET | /api/news | Público | Lista notícias (paginado) |
| POST | /api/news | JWT | Criar notícia |
| PUT | /api/news/:id | JWT | Editar notícia |
| DELETE | /api/news/:id | JWT | Remover notícia |
| GET | /api/activities | Público | Lista atividades |
| GET | /api/testimonials | Público | Lista depoimentos |
| GET | /api/documents | Público | Lista documentos |
| GET | /api/stats | Público | Lista métricas |
| PUT | /api/stats/:keyName | JWT | Atualizar métrica |
| GET | /api/faqs | Público | Lista FAQs |
| POST | /api/upload | JWT | Upload de arquivo |
| GET | /api/health | Público | Verificar status |
