# Docker — stack de serviços

<p align="center">
  <a href="../README.md"><code>Início</code></a> •
  <a href="./README.md"><code>Índice</code></a> •
  <a href="./development.md"><code>Development</code></a> •
  <a href="./docker.md"><code>Docker</code></a> •
  <a href="./api.md"><code>API</code></a> •
  <a href="./architecture.md"><code>Arquitetura</code></a>
</p>

O `docker-compose.yml` dentro de `BackEnd/api_django/` define todos os serviços necessários para executar o back-end sem instalar dependências locais pesadas.

## Serviços
| Serviço | Porta | Descrição | Volume |
| --- | --- | --- | --- |
| `psql` | 5432 | PostgreSQL com PostGIS. | `database_volume` (dados persistentes). |
| `redis` | 6379 | Cache/mensageria usada pelo projeto. | Volátil (sem volume nomeado). |
| `mailhog` | 1025/8025 | Captura e-mails enviados pela aplicação (SMTP + UI web). | Volátil. |
| `django` (opcional) | 8000 | Executa a API dentro do container (caso use `make run-docker`). | Monta código-fonte local. |

## Fluxos comuns

### Subir a stack completa
```bash
make run-docker
# equivale a: docker compose -f docker-compose.yml -p api_django up -d --build
```

### Subir apenas dependências (usar app localmente)
```bash
make docker-deps-up   # ou
docker compose -f docker-compose.yml -p api_django up -d psql redis mailhog
```
Em seguida rode `make run-dev` para usar o código via venv.

### Parar/retomar serviços
```bash
make docker-stop      # pausa containers
make docker-start     # inicia novamente
make docker-restart   # aplica mudanças leves no compose (up -d --no-build)
```

### Resetar dados
- **Apenas volumes do projeto (PSQL):**
  ```bash
  make docker-reset    # down --volumes --remove-orphans
  ```
- **Limpeza completa (containers + volumes + imagens):**
  ```bash
  make docker-clean
  ```

## Dicas
- Use `docker compose -f docker-compose.yml -p api_django logs -f <servico>` para depurar.
- Para remover volumes órfãos manualmente:
  ```bash
  docker volume ls
  docker volume rm <nome>
  docker volume prune -f
  ```
- Quando rodar o Django fora do container, mantenha `POSTGRES_HOST=127.0.0.1`. Dentro do docker, use `POSTGRES_HOST=psql`.
- MailHog UI fica em `http://localhost:8025`. Abra para confirmar se e-mails de teste chegaram.

<p align="right">
  <a href="./development.md"><code>← Development</code></a> |
  <a href="./api.md"><code>Próximo: API →</code></a>
</p>
