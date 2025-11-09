# api/serializers/group/delete.py

from django.contrib.auth.models import Group
from rest_framework import serializers


class GroupDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')