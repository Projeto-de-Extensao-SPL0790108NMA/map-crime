# Mapa Crime — Back-end

API Django do projeto Mapa Crime: autenticação via Simple JWT, CRUD de usuários/grupos/denúncias, relatórios (CSV/XLSX/DOCX), integrações com PostgreSQL/PostGIS, Redis e MailHog, além de documentação Swagger pronta.

## Pré-requisitos para rodar localmente

| Dependência | Versão/observação |
| --- | --- |
| Python | 3.12 (recomendado). Necessário `python3-venv`. |
| `make` | Utilizado para orquestrar venv, migrations e serviços Docker. |
| Docker + Docker Compose | Subir PostgreSQL, Redis e MailHog (`docker compose` v2 ou `docker-compose` v1). |
| Git | Clonar o repositório. |
| Arquivos `.env` | Copie `BackEnd/dotenv_files/.env-example` para `.env.dev` (run-dev) e `.env.prod` (run-docker). Ajuste `POSTGRES_HOST` conforme o ambiente. |

> Dependências opcionais: `psql` CLI (para acessar o banco), `redis-cli` (debug) e ferramentas GIS caso vá manipular geodados fora da API.

## Documentação centralizada

Toda a documentação detalhada mora em `BackEnd/api_django/docs/`:
- `docs/README.md`: índice com navegação rápida entre os tópicos.
- `docs/api.md`: endpoints, autenticação, exemplos de payloads e filtros.
- `docs/development.md`: passo a passo completo para preparar o ambiente local.
- `docs/docker.md`: como subir/derrubar a stack Docker, resetar volumes e depurar.
- `docs/architecture.md`: visão geral de apps, modelos, permissões e fluxos.

Consulte esses arquivos sempre que precisar de instruções aprofundadas.

<p align="center">
  <a href="./docs/README.md"><code>Índice</code></a> •
  <a href="./docs/development.md"><code>Development</code></a> •
  <a href="./docs/docker.md"><code>Docker</code></a> •
  <a href="./docs/api.md"><code>API</code></a> •
  <a href="./docs/architecture.md"><code>Arquitetura</code></a>
</p>

<p align="right">
  <a href="./docs/README.md"><code>Ir para a documentação completa →</code></a>
</p>

## Como começar

1. **Clonar o repositório e acessar o back-end**
   ```bash
   git clone https://github.com/Projeto-de-Extensao-SPL0790108NMA/map-crime.git
   cd BackEnd/api_django
   ```
2. **Configurar os `.env`**  
   ```bash
   cp ../dotenv_files/.env-example ../dotenv_files/.env.dev
   cp ../dotenv_files/.env-example ../dotenv_files/.env.prod
   ```
   - Em `.env.dev` (usado por `make run-dev` e `make run-test`), deixe `POSTGRES_HOST="127.0.0.1"` e demais valores para desenvolvimento.
   - Em `.env.prod` (usado por `make run-docker`), configure `POSTGRES_HOST="psql"` e credenciais de produção/container.
   - Os campos `PROJECT_NAME`/`APP_NAME` definem o título mostrado no Swagger e em e-mails; ajuste-os conforme o branding desejado.
   - `API_PUBLIC_URL` controla o host usado na geração do schema/documentação pública; defina-o para o domínio externo (ex.: `https://api.prdl.shop`) quando estiver em produção.
3. **Criar o ambiente virtual e instalar dependências**
   ```bash
   make venv
   ```
4. **Subir dependências + servidor de desenvolvimento**
   ```bash
   make run-dev
   ```
   Esse alvo sobe PostgreSQL/Redis/MailHog via Docker, espera o banco, aplica migrações, roda `collectstatic`/`seed` e inicia a API com Daphne em `http://localhost:8000/`.

Alternativa totalmente containerizada:
```bash
make run-docker
```

## Comandos principais (`Makefile`)

| Comando | Descrição |
| --- | --- |
| `make run-dev` | Ambiente recomendado: usa `.env.dev`, sobe deps (psql/redis/mailhog) e roda Django via venv. |
| `make run-docker` | Usa `.env.prod` e sobe a stack inteira (containers Django + dependências). |
| `make docker-deps-up` | Apenas PostgreSQL, Redis e MailHog lendo `.env.dev` (para uso com o venv local). |
| `make run-test` | Executa pytest carregando as variáveis de `.env.dev`. |
| `make lint` / `make lint-fix` | Verifica/corrige estilo com Ruff. |
| `make docker-reset` | Para containers e remove volumes (zera o banco). |
| `make docker-clean` | Remove containers, volumes e imagens relacionados. |
| `make gen-secret` | Gera um novo `SECRET_KEY` no terminal. |

Veja a lista completa no próprio `Makefile`.

## Rotas e autenticação

Detalhes sobre endpoints (users, groups, denúncias, heatmap, relatórios, fluxo JWT/2FA) estão em `docs/api.md`. A documentação interativa fica em:
- Swagger UI: `http://localhost:8000/documentation/`
- OpenAPI JSON/YAML: `http://localhost:8000/swagger.json` / `http://localhost:8000/swagger.yaml`

## Testes e qualidade

```bash
make run-test  # executa pytest
make lint      # ruff check .
```

Consulte `CONTRIBUTING.md` para padrões de contribuição.

## Licença

Projeto distribuído sob a licença MIT. Veja `LICENSE` na raiz do repositório.
