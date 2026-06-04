"""Account serializers."""
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from accounts.choices import UserRole
from accounts.models import User
from stores.models import Store


class UserSerializer(serializers.ModelSerializer):
    """Public user representation."""

    role_display = serializers.CharField(source='get_role_display', read_only=True)
    store_name = serializers.CharField(source='store.name', read_only=True, default=None)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email', 'phone',
            'role', 'role_display', 'store', 'store_name', 'is_active',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'role', 'is_active', 'created_at', 'updated_at')


class UserAdminSerializer(serializers.ModelSerializer):
    """Admin user management."""

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email', 'phone',
            'role', 'store', 'is_active', 'password',
        )
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class RegisterSerializer(serializers.Serializer):
    """Customer registration."""

    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    store_name = serializers.CharField(max_length=255)
    store_address = serializers.CharField(max_length=500)
    store_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    store_email = serializers.EmailField(required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Пароли не совпадают.'})
        validate_password(attrs['password'])
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({'username': 'Имя пользователя занято.'})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({'email': 'Email уже зарегистрирован.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        store_data = {
            'name': validated_data.pop('store_name'),
            'address': validated_data.pop('store_address'),
            'phone': validated_data.pop('store_phone', ''),
            'email': validated_data.pop('store_email', ''),
        }
        password = validated_data.pop('password')
        user = User.objects.create(
            **validated_data,
            role=UserRole.CUSTOMER,
        )
        user.set_password(password)
        store = Store.objects.create(**store_data, owner=user)
        user.store = store
        user.save()
        return user


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Profile update for authenticated user."""

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'phone')
        extra_kwargs = {'email': {'required': True}}


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Пароли не совпадают.'})
        validate_password(attrs['password'])
        return attrs
