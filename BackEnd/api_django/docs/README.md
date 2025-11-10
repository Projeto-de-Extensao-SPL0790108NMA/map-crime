# Documentação do Back-end

<p align="center">
  <a href="../README.md"><code>Início</code></a> •
  <a href="./README.md"><code>Índice</code></a> •
  <a href="./development.md"><code>Development</code></a> •
  <a href="./docker.md"><code>Docker</code></a> •
  <a href="./api.md"><code>API</code></a> •
  <a href="./architecture.md"><code>Arquitetura</code></a>
</p>

Tudo o que você precisa para trabalhar na API do Mapa Crime está concentrado nesta pasta.

## Como navegar

| Arquivo | Quando usar |
| --- | --- |
| `docs/development.md` | Precisa rodar o projeto em modo desenvolvimento (Makefile, venv, variáveis `.env`). |
| `docs/docker.md` | Está subindo/derrubando serviços via Docker Compose ou limpando volumes. |
| `docs/api.md` | Quer entender endpoints, payloads, filtros, autenticação e formatos de resposta. |
| `docs/architecture.md` | Deseja uma visão geral de apps, modelos, permissões e integrações. |
| `../CONTRIBUTING.md` | Vai abrir PR ou contribuir com código (convenções, testes, lint). |

## Fluxo rápido
1. Leia `development.md` para preparar o ambiente (dotenv, venv, `make run-dev`).
2. Consulte `docker.md` se for usar apenas a stack containerizada (`make docker-deps-up`, `docker compose down` etc.).
3. Use `api.md` para descobrir endpoints REST, campos, filtros e links para Swagger/Redoc.
4. Recorra a `architecture.md` para entender como as peças (accounts, api, core) se relacionam.

## Outras referências úteis
- `../README.md`: visão geral do repositório completo (front + back).
- `../Makefile`: lista de comandos automatizados mencionados na documentação.
- `../requirements.txt`: dependências Python instaladas no ambiente virtual.

<p align="right">
  <a href="./development.md"><code>Próximo: Development →</code></a>
</p>
