from django.db import models
from .choice import STATUS_CHOICES

class STATUS_CHOICES(models.TextChoices):
    EM_ANALISE = 'em_analise', 'Em análise'
    APROVADO = 'aprovado', 'Aprovado'
    REJEITADO = 'rejeitado', 'Rejeitado'