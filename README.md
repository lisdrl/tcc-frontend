# TCC Frontend

Este repositório reúne três versões de um mesmo frontend desenvolvido com React, TypeScript e Vite. A aplicação simula um gestor de pedidos com integração de chat via Sendbird, permitindo comparar diferentes níveis de organização e desacoplamento da funcionalidade de chat ao longo das versões.

- `version-0`: versão inicial, com a integração do Sendbird mais acoplada aos componentes da aplicação.
- `version-1`: versão intermediária, com provider, configuração e hooks de chat mais centralizados.
- `version-2`: versão mais desacoplada, com uma camada `core` e adapters para isolar a implementação do Sendbird.

## Pré-requisitos

Para rodar sem Docker:

- Node.js 20 ou superior
- npm

Para rodar com Docker:

- Docker

## Rodando com Docker

Os serviços estão configurados no `docker-compose.yml` da raiz. Execute os comandos abaixo a partir da raiz do repositório.

### Version 0

```bash
docker compose up version-0
```

Acesse em: http://localhost:5173

### Version 1

```bash
docker compose up version-1
```

Acesse em: http://localhost:5174

### Version 2

```bash
docker compose up version-2
```

Acesse em: http://localhost:5175

Também é possível subir as três versões ao mesmo tempo:

```bash
docker compose up version-0 version-1 version-2
```

Para parar os containers:

```bash
docker compose down
```

## Rodando sem Docker

Execute os comandos abaixo a partir da raiz do repositório. Se quiser manter mais de uma versão rodando ao mesmo tempo, use um terminal para cada projeto.

### Version 0

```bash
cd version-0
npm install
npm run dev -- --port 5173
```

Acesse em: http://localhost:5173

### Version 1

```bash
cd version-1
npm install
npm run dev -- --port 5174
```

Acesse em: http://localhost:5174

### Version 2

```bash
cd version-2
npm install
npm run dev -- --port 5175
```

Acesse em: http://localhost:5175