from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import SocialAccount

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")

    class Meta:
        model = User
        fields = ("id", "email", "name", "is_social_account", "groups")


class EmailTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True, required=True)
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    user = serializers.DictField(read_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        if not email or not password:
            raise serializers.ValidationError("email and password are required")

        user = authenticate(
            request=self.context.get("request"), username=email, password=password
        )
        if user is None:
            raise serializers.ValidationError("Credenciais inválidas")
        if not user.is_active:
            raise serializers.ValidationError("Usuário inativo")

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        return {
            "refresh": str(refresh),
            "access": access,
            "user": UserSerializer(user).data,
        }


class SocialAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialAccount
        fields = "__all__"
