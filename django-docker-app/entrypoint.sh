#!/bin/sh

# Espera o banco de dados estar disponível
while ! nc -z db 5432; do
  echo "Aguardando o banco de dados..."
  sleep 1
done

# Executa as migrações
python manage.py migrate

# Coleta arquivos estáticos
python manage.py collectstatic --noinput

# Inicia o servidor
exec "$@"