# API de Pagamentos Multi-Gateway

API RESTful para gerenciamento de pagamentos com suporte a múltiplos gateways, desenvolvida com AdonisJS v6, TypeScript e MySQL.

---

## Requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

Não é necessário instalar Node.js, MySQL ou qualquer outra dependência localmente. Tudo roda via Docker.

---

## Como Instalar e Rodar

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd api-ent
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

O `.env` já vem pré-configurado para rodar com Docker. As variáveis dos gateways precisam ser preenchidas:

```env
GATEWAY1_URL=http://mock:3001
GATEWAY1_EMAIL=dev@betalent.tech
GATEWAY1_TOKEN=FEC9BB078BF338F464F96B48089EB498

GATEWAY2_URL=http://mock:3002
GATEWAY2_AUTH_TOKEN=tk_f2198cc671b5289fa856
GATEWAY2_AUTH_SECRET=3d15e8ed6131446ea7e3456728b1211f
```

### 3. Suba os containers

```bash
docker compose up --build
```

Isso irá iniciar:
- **api** — aplicação AdonisJS na porta `3333`
- **mysql** — banco de dados MySQL na porta `3306`
- **mock** — mocks dos gateways nas portas `3001` e `3002`

### 4. Rode as migrations e seeds

Em outro terminal:

```bash
docker compose exec api node ace migration:fresh --seed
```

Isso cria todas as tabelas e popula os gateways e produtos iniciais.

### 5. Acesse a API

```
http://localhost:3333
```

---

## Detalhamento de Rotas

### Rotas Públicas

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/signup` | Cadastro de usuário |
| POST | `/api/login` | Login e geração de token |
| POST | `/api/purchase` | Realiza uma compra |

#### Exemplo — Realizar Compra

```json
POST /api/purchase
{
  "name": "João Silva",
  "email": "joao@email.com",
  "cardNumber": "5569000000006063",
  "cvv": "010",
  "products": [
    { "id": 1, "quantity": 2 }
  ]
}
```

O valor total é calculado pelo backend com base nos produtos e quantidades informados. O sistema tenta o Gateway 1 primeiro e, em caso de falha, usa o Gateway 2 automaticamente.

---

### Rotas Privadas

Todas as rotas abaixo exigem autenticação via Bearer Token:

```
Authorization: Bearer <token>
```

#### Conta

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/account/profile` | Dados do usuário autenticado |
| POST | `/api/account/logout` | Logout |

#### Gateways

| Método | Rota | Descrição |
|--------|------|-----------|
| PATCH | `/api/gateways/:id/toggle` | Ativar/desativar gateway |
| PATCH | `/api/gateways/:id/priority` | Alterar prioridade do gateway |

#### Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/users` | Listar usuários |
| GET | `/api/users/:id` | Detalhe de um usuário |
| POST | `/api/users` | Criar usuário |
| PUT | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Remover usuário |

#### Produtos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/products` | Listar produtos |
| GET | `/api/products/:id` | Detalhe de um produto |
| POST | `/api/products` | Criar produto |
| PUT | `/api/products/:id` | Atualizar produto |
| DELETE | `/api/products/:id` | Remover produto |

#### Clientes

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/clients` | Listar clientes |
| GET | `/api/clients/:id` | Detalhe do cliente com todas as compras |

#### Transações

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/transactions` | Listar todas as transações |
| GET | `/api/transactions/:id` | Detalhe de uma transação |
| POST | `/api/transactions/:id/charge_back` | Realizar reembolso junto ao gateway |

---

## Arquitetura

```
app/
├── controllers/       # Handlers das rotas
├── models/            # Models Lucid ORM
├── services/
│   └── gateways/      # Integração com gateways de pagamento
│       ├── gateway1_service.ts   # Gateway 1 — autenticação Bearer
│       ├── gateway2_service.ts   # Gateway 2 — autenticação por headers
│       ├── manager.ts            # Orquestrador com fallback automático
│       └── interface.ts          # Contrato dos serviços
├── validators/        # Validação de inputs com VineJS
database/
├── migrations/        # Migrations do banco
└── seeders/           # Seeds de gateways e produtos
```

### Fluxo de Compra

1. Validação dos dados de entrada
2. Busca dos produtos no banco e cálculo do total pelo backend
3. Tentativa de cobrança no Gateway 1 (fallback automático para Gateway 2)
4. Busca ou criação do cliente pelo email
5. Persistência da transação e produtos em uma única operação atômica (transaction)
6. Retorno da transação criada

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta da aplicação (padrão: 3333) |
| `HOST` | Host da aplicação (usar `0.0.0.0` no Docker) |
| `APP_KEY` | Chave de criptografia da aplicação |
| `DB_HOST` | Host do MySQL (usar `mysql` no Docker) |
| `DB_PORT` | Porta do MySQL |
| `DB_USER` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |
| `DB_DATABASE` | Nome do banco |
| `GATEWAY1_URL` | URL base do Gateway 1 |
| `GATEWAY1_EMAIL` | Email de autenticação do Gateway 1 |
| `GATEWAY1_TOKEN` | Token de autenticação do Gateway 1 |
| `GATEWAY2_URL` | URL base do Gateway 2 |
| `GATEWAY2_AUTH_TOKEN` | Token de autenticação do Gateway 2 |
| `GATEWAY2_AUTH_SECRET` | Secret de autenticação do Gateway 2 |

---

## Nível Implementado

Este projeto foi desenvolvido no **Nível 2** do desafio:

- ✅ Valor da compra calculado pelo backend a partir dos produtos e quantidades
- ✅ Gateways com autenticação (Bearer token e header-based)
- ✅ Fallback automático entre gateways por ordem de prioridade
- ✅ Docker Compose com MySQL, aplicação e mock dos gateways
- ✅ Validação de inputs com VineJS
- ✅ Dados sensíveis (número do cartão, CVV) não são persistidos

### Pendente (Nível 3)
- Roles de usuário (ADMIN, MANAGER, FINANCE, USER)
- TDD com Japa

---

## Dificuldades Encontradas

- Restrição do MySQL com o prefixo `is_` em nomes de colunas — resolvido renomeando `is_active` para `active_is`
- Comunicação entre containers Docker exige uso do nome do serviço como hostname em vez de `localhost`
- Geração automática do schema pelo Adonis sobrescreve mapeamentos manuais de `columnName` — resolvido mantendo os mapeamentos no schema gerado