# Desenvolvimento local

<p align="center">
  <a href="../README.md"><code>Início</code></a> •
  <a href="./README.md"><code>Índice</code></a> •
  <a href="./development.md"><code>Development</code></a> •
  <a href="./docker.md"><code>Docker</code></a> •
  <a href="./api.md"><code>API</code></a> •
  <a href="./architecture.md"><code>Arquitetura</code></a>
</p>

Guia rápido para preparar o ambiente, subir as dependências e executar a API em modo desenvolvimento.

## Requisitos
- Python **3.12**
- `make`
- Docker + Docker Compose (CLI v2 ou v1; o Makefile detecta automaticamente)
- Arquivo `.env` já configurado em `BackEnd/dotenv_files/.env` (o `settings.py` lê direto dali)

## Passo a passo

### 1. Verifique o `.env`
- Copie/edite `BackEnd/dotenv_files/.env` com credenciais locais (vide `.env.example` na raiz, se existir).
- Para rodar Django localmente (fora do container), use `POSTGRES_HOST="127.0.0.1"`.
- Para rodar a app dentro dos containers (`make run-docker`), mude para `POSTGRES_HOST="psql"`.

### 2. Instale dependências Python
O comando abaixo cria/atualiza `./venv` e instala `requirements.txt`:
```bash
make venv
```

### 3. Suba as dependências e o servidor
```bash
make run-dev
```
O alvo faz:
1. Sobe PostgreSQL, Redis e MailHog via Docker (`docker-deps-up`) e espera o banco ficar pronto.
2. Carrega variáveis de ambiente do `.env`.
3. Executa `makemigrations`, `migrate`, `collectstatic` e `seed`.
4. Inicia o servidor ASGI com Daphne em `http://localhost:8000/` (Ctrl+C para parar).

Se preferir rodar tudo via containers:
```bash
make run-docker
```

### 4. Testes e lint
```bash
make run-test     # pytest
make lint         # Ruff (lint)
make lint-fix     # Ruff com --fix
```

### 5. Comandos úteis do Makefile
- `make docker-deps-up`: apenas dependências (psql/redis/mailhog) — bom para interagir com Django via venv/VS Code.
- `make docker-stop|docker-start|docker-restart`: controle dos serviços do `docker-compose.yml`.
- `make docker-reset`: para tudo e remove volumes (zera banco).
- `make docker-clean`: remove containers, volumes e imagens (download/rebuild completo na próxima execução).
- `make gen-secret`: imprime um novo `SECRET_KEY`.
- `make clean`: remove o `venv`.

### 6. Testando o stack todo
- MailHog UI: `http://localhost:8025` (SMTP em `127.0.0.1:1025`)
- Redis: `localhost:6379` (senha vazia)
- PostgreSQL: `localhost:5432` (credenciais do `.env`)
- Swagger: `http://localhost:8000/documentation/`

## Dicas e solução de problemas
- **Erro ao carregar `.env` via shell:** não use `source`. O `settings.py` já lê `dotenv_files/.env` e o Makefile usa `set -o allexport` para exportar variáveis.
- **`psql` não sobe em 30s:** veja logs com `docker compose -f docker-compose.yml -p api_django logs psql` e confirme host/senha no `.env`.
- **Uploads e arquivos estáticos:** o `settings.py` cria `BASE_DIR/static` automaticamente; `collectstatic` coloca arquivos em `BASE_DIR/staticfiles`.
- **Recriar banco limpo:** `make docker-reset` seguido de `make run-dev`.

<p align="right">
  <a href="./README.md"><code>← Voltar ao Índice</code></a> |
  <a href="./docker.md"><code>Próximo: Docker →</code></a>
</p>
