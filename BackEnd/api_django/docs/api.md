# API — Referência completa

<p align="center">
  <a href="../README.md"><code>Início</code></a> •
  <a href="./README.md"><code>Índice</code></a> •
  <a href="./development.md"><code>Development</code></a> •
  <a href="./docker.md"><code>Docker</code></a> •
  <a href="./api.md"><code>API</code></a> •
  <a href="./architecture.md"><code>Arquitetura</code></a>
</p>

Este documento descreve os endpoints expostos pela API Django do Mapa Crime, como autenticar e como testar rapidamente cada recurso.

## URLs base e ferramentas
- **API base (default dev):** `http://localhost:8000/`
- **Prefixos principais:** `/auth/…` (autenticação) e `/api/…` (CRUD de domínio)
- **Documentação interativa:** `http://localhost:8000/documentation/` (Swagger UI — drf-yasg)
- **Schema JSON/YAML:** `http://localhost:8000/swagger.json` e `http://localhost:8000/swagger.yaml`
  - Ajuste `API_PUBLIC_URL` no `.env` para forçar URL absoluta correta nos links da documentação.

## Autenticação e segurança
- Autorização padrão: `Authorization: Bearer <access_token>` em requisições protegidas.
- Tokens são emitidos pelo Simple JWT.
- Permissões finas dependem de grupos Django:
  - `IsAdmin`: pertence ao grupo `Admin` ou é superuser.
  - `IsUser`: pertence ao grupo `User`.
- Uploads de mídia/áudio em denúncias aceitam no máximo **3 arquivos por requisição** (ver validação em `api/serializers/denuncia/utils.py`).

### Endpoints de autenticação (`/auth/`)

| Método | Caminho | Finalidade | Autenticação | Payload essencial |
| --- | --- | --- | --- | --- |
| POST | `/auth/token/` | Gera `access` + `refresh` via e-mail e senha. | Pública | `{"email": "...", "password": "..."}` |
| POST | `/auth/token/refresh/` | Troca refresh válido por novo access. | Pública | `{"refresh": "<token>"}` |
| POST | `/auth/token/google/` | Login social usando `id_token` do Google. Cria usuário se não existir. | Pública | `{"token": "<id_token>"}` |
| POST | `/auth/logout/` | Invalida o refresh (blacklist). | Bearer | `{"refresh": "<token>"}` |
| POST | `/auth/password/reset/` | Envia e-mail com link de redefinição. | Pública | `{"email": "user@example.com"}` |
| POST | `/auth/password/reset/confirm/<uid>/<token>/` | Define nova senha via link. | Pública | `{"password": "NovaSenha123"}` |
| POST | `/auth/2fa/enable/` | Gera secret + QR para TOTP. | Bearer | Nenhum — retorna `{secret, qr}` |
| POST | `/auth/2fa/verify/` | Valida código TOTP. Opcionalmente troca senha se `password` vier no corpo. | Bearer | `{"code": "123456", "password": "NovaSenha?"}` |

**Exemplo de login + chamada autenticada**

```bash
curl -X POST http://localhost:8000/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Senha123"}'

# Depois:
curl http://localhost:8000/api/users/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Convenções de resposta e erros
- Respostas de sucesso seguem os serializers declarados em cada view.
- Erros seguem o padrão DRF: `{"detail": "...", ...}` e status HTTP adequados (400 validação, 401 credenciais inválidas, 403 permissão insuficiente).
- Para listagens paginadas (`ListAPIView` com `PageNumberPagination`), espere:
  ```json
  {
    "count": 120,
    "next": "http://host/api/users/?page=2",
    "previous": null,
    "results": [ ... ]
  }
  ```

## Recursos REST sob `/api/`

### Users

| Método | Caminho | Descrição | Permissões | Observações |
| --- | --- | --- | --- | --- |
| GET | `/api/users/` | Lista usuários com paginação (20 itens padrão). | `IsAuthenticated` + (`Admin` ou `User`) | Filtros padrão DRF (`?page=`/`?page_size=`). |
| POST | `/api/users/create/` | Cria usuário informando `email`, `name`, `password`, `is_active`, `is_staff`. | `IsAuthenticated` + grupo conforme política | Campos validados pelo `UserCreateSerializer`. |
| GET | `/api/users/<id>/` | Detalhes de um usuário. | Mesmo acima | |
| PUT/PATCH | `/api/users/<id>/update/` | Atualiza campos básicos (`name`, `is_active`, etc.). | Mesmo acima | |
| DELETE | `/api/users/<id>/delete/` | Remove usuário. | Mesmo acima | |

Serializers principais:
- `UserListSerializer`: retorna `id`, `email`, `name`, `is_active`, `is_staff`.
- `UserCreateSerializer`: exige `password` (write-only) e usa `create_user` para hashing adequado.

### Groups

Estrutura idêntica aos endpoints de usuário, mas aplicando serializers de grupo. Utilize `/api/groups/...` para criar, listar e editar grupos padrão do Django. Útil para manter as permissões `Admin` e `User` mencionadas acima.

### Denúncias (`/api/denuncias/…`)

| Método | Caminho | Descrição | Permissões | Extras |
| --- | --- | --- | --- | --- |
| GET | `/api/denuncias/` | Lista denúncias ordenadas por `created_at` desc. | `IsAuthenticated` + (`Admin` ou `User`) | Filtros: `status`, `categoria`, `created_from`, `created_to` (ISO-8601, aceita data ou data-hora). |
| POST | `/api/denuncias/create/` | Cria denúncia. | Pública (AllowAny) | Aceita `multipart/form-data` ou JSON. Envie `categoria`, `descricao`, `latitude`, `longitude`, `status?`, `midia?`, `audio?`. |
| GET | `/api/denuncias/<uuid>/` | Detalhes completos (`DenunciaDetailSerializer`). | `IsAuthenticated` + (`Admin` ou `User`) | |
| PUT/PATCH | `/api/denuncias/<uuid>/update/` | Atualiza campos. | Mesmo acima | |
| DELETE | `/api/denuncias/<uuid>/delete/` | Exclui denúncia. | Mesmo acima | |
| GET | `/api/denuncias/heatmap/` | Pontos leves para mapas de calor. | Pública | Query params: `bbox=minx,miny,maxx,maxy`, `start_date`, `end_date`, `limit`. Retorna `categoria`, `lat`, `lng`, `date`, `weight`. |
| GET | `/api/denuncias/relatorios/` | Exporta CSV/XLSX/DOCX com resumo por status. | `IsAuthenticated` + (`Admin` ou `User`) | Params: `formato=csv|xlsx|docs`, `data_inicio`, `data_fim`. Retorna arquivo para download. |

**Status possíveis**

Valores definidos em `api.choice.STATUS_CHOICES`: `em_analise`, `aprovado`, `rejeitado`. Use-os nos filtros e ao atualizar `status`.

**Criando uma denúncia (multipart)**

```bash
curl -X POST http://localhost:8000/api/denuncias/create/ \
  -F "categoria=furto" \
  -F "descricao=Roubo registrado pela vizinhança" \
  -F "latitude=-3.0987" \
  -F "longitude=-60.0213" \
  -F "midia=@/caminho/foto.jpg"
```

### Relatórios e visualizações
- **Heatmap**: retorna pontos simplificados (`lat`, `lng`, `weight`) e aceita BBOX + janelas de data para alimentar mapas no front.
- **Relatório CSV/XLSX/DOCX**: consolida contagem por status e lista detalhada com `protocolo`, `categoria`, `status_label`, `created_at`, `descricao`.

## Testando e inspecionando rotas

Listar rapidamente todas as rotas carregadas:

```bash
python - <<'PY'
import os, django; os.environ.setdefault('DJANGO_SETTINGS_MODULE','core.settings'); django.setup()
from django.urls import get_resolver
for pattern in get_resolver().url_patterns:
    print(pattern.pattern, getattr(pattern, 'name', None))
PY
```

Verificar respostas localmente:
- `make run-dev` — sobe API com PostgreSQL, Redis e MailHog.
- `make test` ou `pytest` — testa serializers/views críticos.
- Utilize o Swagger (`/documentation/`) para executar chamadas autenticadas direto no navegador (envie o header `Authorization` pela interface).

## Problemas comuns e soluções rápidas
- **`TemplateDoesNotExist drf-yasg/swagger-ui.html`**: garanta `drf_yasg` em `INSTALLED_APPS` e dependência instalada.
- **Erro ao gerar schema**: revise serializers referenciando campos inexistentes (ex.: `username` em model que usa `email`).
- **Uploads negados**: lembre do limite de 3 arquivos por requisição (soma de `midia` + `audio`). Ajuste antes de reenviar.

<p align="right">
  <a href="./docker.md"><code>← Docker</code></a> |
  <a href="./architecture.md"><code>Próximo: Arquitetura →</code></a>
</p>
