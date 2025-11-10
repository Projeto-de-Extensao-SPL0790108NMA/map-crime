# Front-end — Mapa Crime

Aplicação React + TypeScript (Vite) que consome a API do Mapa Crime e renderiza o mapa, o fluxo de denúncias e os painéis administrativos.

<p align="center">
  <a href="../README.md"><code>Raiz</code></a> •
  <a href="../BackEnd/api_django/README.md"><code>Back-end</code></a> •
  <a href="./README.md"><code>Front-end</code></a>
</p>

## Visão geral
- Stack: React 19, Vite, Tailwind CSS 4, ShadCN UI, React Query, TanStack Router.
- Padrões: ESLint, Prettier, Vitest e Testing Library.
- Diretório raiz: `web/`.

## Requisitos
- Node.js 18+ (recomendado LTS mais recente).
- pnpm (preferido) ou npm/yarn.
- Backend rodando em `http://localhost:8000` (ajuste `.env` conforme necessário).

## Setup rápido
```bash
cd web
pnpm install            # ou npm install / yarn
pnpm dev                # inicia Vite em http://localhost:3000
```

Por padrão o script `dev` usa a porta 3000 (`package.json`). Ajuste em `vite.config.ts` se necessário.

## Scripts disponíveis
| Script | Descrição |
| --- | --- |
| `pnpm dev` | Inicia ambiente de desenvolvimento com Vite. |
| `pnpm build` | Gera build otimizado + `tsc` para checar tipos. |
| `pnpm serve` | Prévia do build (`vite preview`). |
| `pnpm test` | Executa tests via Vitest. |
| `pnpm lint` | Executa ESLint com config TanStack. |
| `pnpm format` | Roda Prettier. |
| `pnpm check` | Prettier + ESLint com `--fix`. |

## Variáveis de ambiente
Crie um arquivo `.env` em `web/` (ou `.env.local`) com:
```bash
VITE_API_URL=http://localhost:8000
```
Use esse endpoint para apontar para a API (produção/homologação).

## Estrutura resumida
```
web/
├─ src/
│  ├─ components/      # UI reutilizável (ShadCN/Tailwind)
│  ├─ features/        # módulos de domínio (ex.: denuncias)
│  ├─ routes/          # TanStack Router
│  ├─ lib/             # utilitários, clients axios, etc.
│  └─ styles/          # CSS/Tailwind extras
├─ public/             # assets estáticos
├─ vite.config.ts
├─ tsconfig.json
└─ package.json
```

## Testes
```bash
pnpm test        # Vitest em modo run
pnpm test --ui   # (opcional) interface interativa
```
Garanta que componentes que dependem da API sejam testados com mocks (MSW ou fixtures locais).

## Deploy / Build
1. Gere o build: `pnpm build`.
2. Hospede a pasta `web/dist` (ex.: Vercel, Netlify, S3+CloudFront).
3. Configure variáveis `VITE_API_URL` no ambiente de deploy.

Consulte `package.json` para versões exatas das dependências.
