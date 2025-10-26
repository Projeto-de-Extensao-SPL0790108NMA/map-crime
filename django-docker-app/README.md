# Django Docker App

Este projeto é uma aplicação Django configurada para ser executada em contêineres Docker. Abaixo estão as instruções para instalação e uso.

## Pré-requisitos

- Docker
- Docker Compose
- Python 3.x (opcional, para desenvolvimento local)

## Estrutura do Projeto

```
django-docker-app
├── manage.py
├── requirements.txt
├── Pipfile
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
├── entrypoint.sh
├── project_name
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps
│   └── core
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── views.py
│       └── urls.py
├── static
├── templates
│   └── base.html
├── tests
│   └── test_basic.py
├── .gitignore
└── README.md
```

## Instalação

1. Clone o repositório:
   ```
   git clone <URL_DO_REPOSITORIO>
   cd django-docker-app
   ```

2. Crie um arquivo `.env` com as variáveis de ambiente necessárias.

3. Construa a imagem Docker:
   ```
   docker-compose build
   ```

## Uso

Para iniciar a aplicação, execute:
```
docker-compose up
```

A aplicação estará disponível em `http://localhost:8000`.

## Comandos Úteis

- Para executar migrações:
  ```
  docker-compose run web python manage.py migrate
  ```

- Para criar um superusuário:
  ```
  docker-compose run web python manage.py createsuperuser
  ```

- Para executar testes:
  ```
  docker-compose run web python manage.py test
  ```

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Faça um fork do repositório e envie um pull request.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.