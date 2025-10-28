from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group

class Command(BaseCommand):
    help = "Cria grupos padrão: Admin, User"

    def handle(self, *args, **options):
        groups = ['Admin', 'User']
        for g in groups:
            group, created = Group.objects.get_or_create(name=g)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Grupo {g} criado.'))
            else:
                self.stdout.write(self.style.WARNING(f'Grupo {g} já existe.'))
