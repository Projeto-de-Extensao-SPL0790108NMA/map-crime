# api/serializers/Denuncia/history.py

from rest_framework import serializers

from api.serializers.user.detail import UserDetailSerializer


class DenunciaHistoryEntrySerializer(serializers.Serializer):
    field = serializers.CharField()
    old_value = serializers.JSONField(allow_null=True)
    new_value = serializers.JSONField(allow_null=True)
    changed_at = serializers.DateTimeField()
    user = UserDetailSerializer(allow_null=True)
