from django.db import models


class StatusChoices(models.TextChoices):
    EM_ANALISE = "em_analise", "Em análise"
    APROVADO = "aprovado", "Aprovado"
    REJEITADO = "rejeitado", "Rejeitado"


# Expose constant with the same name expected elsewhere in the project
STATUS_CHOICES = StatusChoices
