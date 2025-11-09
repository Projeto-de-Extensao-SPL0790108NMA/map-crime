FROM python:3.13-slim

WORKDIR /app
COPY requirements.txt .

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV DJANGO_SETTINGS_MODULE=core.settings

COPY . .

RUN mkdir -p /data/web/staticfiles
RUN python -m venv /venv

# instalar dependências do sistema ANTES do pip para que GDAL/PROJ estejam disponíveis
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential gcc g++ python3-dev \
      gdal-bin libgdal-dev proj-bin libproj-dev libgeos-dev \
      ca-certificates wget && \
    rm -rf /var/lib/apt/lists/*

# criar symlink estável e expor variavel para o Django
RUN set -eux; \
    if ldconfig -p | grep -i libgdal > /dev/null 2>&1; then \
      LD_PATH="$(ldconfig -p | grep -i libgdal | head -n1 | awk '{print $NF}')"; \
      ln -sf "$LD_PATH" /usr/lib/libgdal.so || true; \
    fi
ENV GDAL_LIBRARY_PATH=/usr/lib/libgdal.so

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]