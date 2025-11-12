from __future__ import annotations

from collections.abc import Iterable
from typing import Any, ClassVar

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions.groups import IsAdmin, IsUser
from api.models import Denuncia
from api.serializers import DenunciaHistoryEntrySerializer, UserDetailSerializer

User = get_user_model()


class DenunciaHistoryListView(APIView):
    """Retorna o histórico de alterações relevantes (status/usuario) de uma denúncia."""

    permission_classes: ClassVar = [IsAuthenticated, IsAdmin | IsUser]
    TRACKED_FIELDS: ClassVar[dict[str, dict[str, Any]]] = {
        "status": {"attr": "status", "label": "status", "type": "text"},
        "usuario": {"attr": "usuario_id", "label": "usuario", "type": "user"},
    }

    @swagger_auto_schema(
        tags=["Denuncias"],
        operation_description="Lista quem alterou os campos monitorados da denúncia, o valor anterior/novo e o momento da alteração.",
        operation_id="denuncia_history",
        responses={200: DenunciaHistoryEntrySerializer(many=True)},
    )
    def get(self, request, pk: str):
        if getattr(self, "swagger_fake_view", False):
            return Response([])
        denuncia = get_object_or_404(Denuncia, pk=pk)
        entries = self._build_history_entries(denuncia)
        serializer = DenunciaHistoryEntrySerializer(entries, many=True)
        return Response(serializer.data)

    def _build_history_entries(self, denuncia: Denuncia) -> list[dict[str, Any]]:
        history = list(denuncia.history.order_by("-history_date"))
        results: list[dict[str, Any]] = []
        if len(history) < 2:
            return results

        self._user_cache: dict[Any, User | None] = {}
        for idx in range(len(history) - 1):
            current = history[idx]
            previous = history[idx + 1]
            results.extend(self._diff_records(current, previous))
        return results

    def _diff_records(self, current, previous) -> Iterable[dict[str, Any]]:
        for field, config in self.TRACKED_FIELDS.items():
            attr = config["attr"]
            new_raw = getattr(current, attr)
            old_raw = getattr(previous, attr)
            if new_raw == old_raw:
                continue
            yield {
                "field": config["label"],
                "old_value": self._format_value(field, old_raw),
                "new_value": self._format_value(field, new_raw),
                "changed_at": current.history_date,
                "user": self._serialize_history_user(current.history_user),
            }

    def _format_value(self, field: str, raw_value: Any):
        if field == "status":
            return raw_value
        if field == "usuario":
            user = self._get_user(raw_value)
            return self._serialize_user(user)
        return raw_value

    def _serialize_history_user(self, user: User | None):
        if not user:
            return None
        return UserDetailSerializer(user).data

    def _serialize_user(self, user: User | None):
        if not user:
            return None
        return UserDetailSerializer(user).data

    def _get_user(self, user_id):
        if not user_id:
            return None
        if not hasattr(self, "_user_cache"):
            self._user_cache = {}
        if user_id not in self._user_cache:
            self._user_cache[user_id] = User.objects.filter(pk=user_id).first()
        return self._user_cache[user_id]
