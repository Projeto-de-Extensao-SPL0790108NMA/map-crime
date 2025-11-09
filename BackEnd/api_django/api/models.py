import os
import uuid

import ulid
from django.contrib.gis.db import models as geomodels
from django.db import models

from accounts.models import User

from . import choice


def denuncia_midia_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{instance.id}.{ext}"
    return os.path.join('denuncias_midias', filename)


def denuncia_audio_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{instance.id}.{ext}"
    return os.path.join('denuncias_audios', filename)


def ulid_str():
    return str(ulid.new())
    

class Denuncia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, default=None, null=True, blank=True)
    protocolo = models.CharField(max_length=26, unique=True, default=ulid_str, editable=False, db_index=True)
    categoria = models.CharField(max_length=100)
    descricao = models.TextField(max_length=1000)
    localizacao = geomodels.PointField()
    midia = models.FileField(upload_to=denuncia_midia_upload_path, blank=True, null=True)
    audio = models.FileField(upload_to=denuncia_audio_upload_path, blank=True, null=True)
    status = models.CharField(max_length=20, choices=choice.STATUS_CHOICES.choices, default=choice.STATUS_CHOICES.EM_ANALISE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.categoria