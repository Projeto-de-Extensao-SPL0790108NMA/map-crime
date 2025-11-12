from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta
from typing import Any, ClassVar

from django.contrib.auth import get_user_model
from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions.groups import IsAdmin, IsUser
from api.choice import StatusChoices
from api.models import Denuncia
from api.serializers.user.detail import UserDetailSerializer

User = get_user_model()

MONTH_PT = {
    1: "janeiro",
    2: "fevereiro",
    3: "março",
    4: "abril",
    5: "maio",
    6: "junho",
    7: "julho",
    8: "agosto",
    9: "setembro",
    10: "outubro",
    11: "novembro",
    12: "dezembro",
}


@dataclass
class MonthSummary:
    total: int
    resolved: int
    rate: float


class DenunciaDashboardView(APIView):
    """Métricas agregadas para dashboard usando `django-simple-history`."""

    permission_classes: ClassVar = [IsAuthenticated, IsAdmin | IsUser]

    @swagger_auto_schema(
        tags=["Deshboard"],
        operation_description="Retorna métricas e comparativos de resolução por mês.",
        responses={200: "OK"},
        operation_id="denuncia_dashboard_metrics",
    )
    def get(self, request):
        metrics = self._build_metrics()
        return Response({"metrics": metrics})

    def _build_metrics(self) -> dict[str, Any]:
        now = timezone.localtime()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        previous_month_end = current_month_start - timedelta(seconds=1)
        previous_month_start = previous_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        metrics = {
            "totalActiveUsers": User.objects.filter(is_active=True).count(),
            "totalReports": Denuncia.objects.count(),
            "reportsByStatus": self._reports_by_status(),
            "resolutionRateComparison": {
                "currentMonth": self._format_segment(current_month_start, now),
                "lastMonth": self._format_segment(previous_month_start, previous_month_end),
            },
        }
        current_rate = metrics["resolutionRateComparison"]["currentMonth"]["rate"]
        last_rate = metrics["resolutionRateComparison"]["lastMonth"]["rate"]
        difference = current_rate - last_rate
        percentage_change = (
            round((difference / last_rate) * 100, 2) if last_rate else (0 if difference == 0 else None)
        )
        metrics["resolutionRateComparison"]["difference"] = difference
        metrics["resolutionRateComparison"]["percentageChange"] = percentage_change
        return metrics

    def _reports_by_status(self) -> dict[str, int]:
        return {
            "rejected": Denuncia.objects.filter(status=StatusChoices.REJEITADO).count(),
            "pending": Denuncia.objects.filter(status=StatusChoices.EM_ANALISE).count(),
            "resolved": Denuncia.objects.filter(status=StatusChoices.APROVADO).count(),
        }

    def _format_segment(self, start: timezone.datetime, end: timezone.datetime) -> dict[str, Any]:
        summary = self._month_summary(start, end)
        month_label = f"{MONTH_PT[start.month]} de {start.year}"
        return {
            "month": month_label,
            "total": summary.total,
            "resolved": summary.resolved,
            "rate": summary.rate,
        }

    def _month_summary(self, start: timezone.datetime, end: timezone.datetime) -> MonthSummary:
        period = Denuncia.objects.filter(created_at__gte=start, created_at__lte=end)
        total = period.count()
        resolved = period.filter(status=StatusChoices.APROVADO).count()
        rate = self._calculate_percentage(resolved, total)
        return MonthSummary(total=total, resolved=resolved, rate=rate)

    def _calculate_percentage(self, numerator: int, denominator: int) -> float:
        if denominator == 0:
            return 0.0
        return round((numerator / denominator) * 100, 2)

