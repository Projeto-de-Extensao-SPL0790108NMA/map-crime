# api/serializers/User/detail.py

from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()
USERNAME_FIELD = User.USERNAME_FIELD


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # campos existentes no model User
        fields = ('id', USERNAME_FIELD, 'name', 'organization', 'is_active', 'is_staff')