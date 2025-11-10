# Arquitetura do Back-end

<p align="center">
  <a href="../README.md"><code>Início</code></a> •
  <a href="./README.md"><code>Índice</code></a> •
  <a href="./development.md"><code>Development</code></a> •
  <a href="./docker.md"><code>Docker</code></a> •
  <a href="./api.md"><code>API</code></a> •
  <a href="./architecture.md"><code>Arquitetura</code></a>
</p>

Este arquivo descreve como os principais módulos da API Django estão organizados e como os fluxos críticos (autenticação, denúncias e relatórios) se conectam.

## Visão geral dos apps

| App | Responsabilidades principais | Dependências chave |
| --- | --- | --- |
| `core` | Configurações globais (`settings.py`), roteamento (`core.urls`), carregamento de `.env`, integração com Swagger. | `dotenv`, `drf_yasg`, `whitenoise`. |
| `accounts` | Modelo de usuário customizado (email como login), permissões por grupos, autenticação JWT, login via Google, 2FA (TOTP), redefinição de senha, logout com blacklist. | `rest_framework_simplejwt`, `pyotp`, `qrcode`, `MailHog`/SMTP. |
| `api` | Modelos de domínio (Denúncia), serializers, views e endpoints REST (users, groups, denúncias, heatmap, relatórios). | `django.contrib.gis`, `drf_yasg`, `docx`, `openpyxl`. |

Outros diretórios relevantes:
- `denuncias_midias/` e `denuncias_audios/`: uploads físicos armazenados pelo `FileField`.
- `static/` e `staticfiles/`: arquivos estáticos (WhiteNoise) — criados automaticamente em `settings.py`.

## Modelo de dados

### Usuários (`accounts.models.User`)
- Campos principais: `email` (login), `name`, `is_active`, `is_staff`, `is_social_account`, `totp_secret`, `route_permissions` (JSON).
- Gerenciador customizado garante hashing correto em `create_user` / `create_superuser`.
- Grupos (`django.contrib.auth.models.Group`) definem regras das permissões `IsAdmin` e `IsUser`.

### SocialAccount
- Guarda o vínculo com provedores OAuth (por ora Google) para reaproveitar cadastros.
- `unique_together` em `(provider, social_id)` evita duplicatas.

### Denúncia (`api.models.Denuncia`)
- Campos: `id` (UUID), `protocolo` (ULID legível, indexado), `categoria`, `descricao`, `localizacao` (`PointField`), `midia`, `audio`, `status`, timestamps.
- `STATUS_CHOICES`: `em_analise`, `aprovado`, `rejeitado` (ver `api/choice.py`).
- Uploads são guardados em subpastas (`denuncias_midias`, `denuncias_audios`) identificadas pelo `id`.

## Fluxos principais

### Autenticação
1. **Email + senha (`/auth/token/`)** — `EmailTokenObtainPairView` valida credenciais e retorna `{refresh, access, user}`.
2. **Token refresh (`/auth/token/refresh/`)** — renova o access.
3. **Login social (`/auth/token/google/`)** — valida `id_token` no endpoint do Google, cria/associa usuário e gera tokens.
4. **2FA (TOTP)** — `/auth/2fa/enable/` gera `totp_secret` + QR, `/auth/2fa/verify/` confirma código e opcionalmente troca senha.
5. **Logout** — `/auth/logout/` invalida o refresh token via blacklist (`rest_framework_simplejwt.token_blacklist` habilitado em `INSTALLED_APPS`).

### Denúncias
1. **Criação pública** — `DenunciaCreateView` aceita JSON ou `multipart/form-data`, converte `latitude/longitude` em `PointField` (SRID 4326) e registra protocolo ULID.
2. **Listagem interna** — `DenunciaListView` aplica filtros de status, categoria e período e só aceita usuários autenticados em grupos válidos.
3. **Heatmap** — endpoint público que retorna pontos agregados (`lat`, `lng`, `weight`) com filtros de bounding box e data para alimentar mapas.
4. **Relatórios** — `DenunciaReportView` agrega `Denuncia` por status, gera arquivos CSV/XLSX/DOCX e entrega como download; utiliza `docx` e `openpyxl`.

### Relacionamentos
- Usuários (`accounts.User`) podem estar ligados a várias denúncias (`Denuncia.usuario`), mas a criação pública não exige autenticação (campo pode ficar `null`).
- Permissões de API dependem de grupos; atribua usuários aos grupos `Admin` ou `User` para liberar os endpoints protegidos (`accounts.permissions.groups`).
- Redis é utilizado por outras partes do projeto (ex.: cache, WebSocket), enquanto PostgreSQL (PostGIS) armazena geodados e resto do modelo.

## Infraestrutura

- **Banco**: PostgreSQL + PostGIS (acessível como `psql` dentro do `docker-compose`). Ajuste `POSTGRES_HOST` conforme roda local/containers.
- **Cache/Mensageria**: Redis (subido junto via `make run-dev`).
- **MailHog**: usado para testes de e-mail (porta 8025).
- **Serviços Docker**: definidos em `api_django/docker-compose.yml`. `make docker-deps-up` sobe PostgreSQL, Redis e MailHog; `make run-dev` cuida do app Django + dependências.

## Observabilidade e documentação

- `drf_yasg` gera Swagger UI em `/documentation/` e os schemas em `/swagger.(json|yaml)`.
- Utilize `python manage.py show_urls` (ou o snippet em `docs/api.md`) para debugar rotas carregadas quando adicionar novos endpoints.
- Logs padrão ficam no console; configure `LOGGING` no `settings.py` se precisar persistir em arquivo/serviço externo.

<p align="right">
  <a href="./api.md"><code>← API</code></a> |
  <a href="./README.md"><code>Voltar para o Índice</code></a>
</p>
