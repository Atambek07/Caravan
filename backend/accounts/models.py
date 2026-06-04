"""User and role models."""
from django.contrib.auth.models import AbstractUser
from django.db import models

from accounts.choices import UserRole
from accounts.managers import UserManager


class User(AbstractUser):
    """Platform user with role-based access."""

    email = models.EmailField('Email', unique=True)
    phone = models.CharField('Телефон', max_length=20, blank=True)
    role = models.CharField(
        'Роль',
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.CUSTOMER,
    )
    store = models.ForeignKey(
        'stores.Store',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='customers',
        verbose_name='Магазин',
    )
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлён', auto_now=True)

    objects = UserManager()

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.username} ({self.get_role_display()})'

    @property
    def is_admin(self) -> bool:
        return self.role == UserRole.ADMIN

    @property
    def is_product_manager(self) -> bool:
        return self.role == UserRole.PRODUCT_MANAGER

    @property
    def is_customer(self) -> bool:
        return self.role == UserRole.CUSTOMER
