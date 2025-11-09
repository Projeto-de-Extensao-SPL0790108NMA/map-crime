# api/serializers/group/update.py

from django.contrib.auth.models import Group, Permission
from rest_framework import serializers


class GroupUpdateSerializer(serializers.ModelSerializer):
    permissions = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Permission.objects.all(), required=False
    )

    class Meta:
        model = Group
        fields = ('id', 'name', 'permissions')

    def update(self, instance, validated_data):
        perms = validated_data.pop('permissions', None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        if perms is not None:
            instance.permissions.set(perms)
        return instance
