from datetime import timedelta
import random
import uuid

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.gis.geos import Point

from api.models import Denuncia
from api import choice


class Command(BaseCommand):
    help = "Cria denúncias fictícias."

    def add_arguments(self, parser):
        parser.add_argument("--total", type=int, default=200, help="Quantidade desejada.")

    def handle(self, *args, **options):
        total = max(0, options["total"])
        existentes = Denuncia.objects.count()
        faltantes = max(0, total - existentes)

        if faltantes == 0:
            self.stdout.write(self.style.WARNING("Nenhuma denúncia nova necessária."))
            return

        categorias = [
            "Furto", "Roubo", "Vandalismo", "Violência", "Tráfico",
            "Perturbação", "Depredação", "Briga", "Fraude", "Outros"
        ]
        status_source = getattr(choice.STATUS_CHOICES, "choices", choice.STATUS_CHOICES)
        status_choices = [item[0] for item in status_source]
        agora = timezone.now()
        denuncias = []

        for i in range(faltantes):
            dias = random.randint(0, 180)
            horas = random.randint(0, 23)
            minutos = random.randint(0, 59)
            created_at = agora - timedelta(days=dias, hours=horas, minutes=minutos)
            updated_at = created_at + timedelta(hours=random.randint(0, 72))

            lat = random.uniform(-33.75, 5.27)
            lon = random.uniform(-73.98, -34.79)

            denuncias.append(
                Denuncia(
                    id=uuid.uuid4(),
                    categoria=random.choice(categorias),
                    descricao=f"Denúncia automática #{existentes + i + 1}",
                    localizacao=Point(lon, lat, srid=4326),
                    status=random.choice(status_choices),
                    created_at=created_at,
                    updated_at=updated_at,
                )
            )

        Denuncia.objects.bulk_create(denuncias, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f"{len(denuncias)} denúncias criadas."))
