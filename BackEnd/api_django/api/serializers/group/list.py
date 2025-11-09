# api/serializers/group/list.py

from django.contrib.auth.models import Group
from rest_framework import serializers


class GroupListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')  # evite listar todas as permissões por padrão