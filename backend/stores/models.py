"""Store models."""
from django.conf import settings
from django.db import models


class Store(models.Model):
    """Retail store placing orders."""

    name = models.CharField('Название', max_length=255)
    address = models.TextField('Адрес')
    phone = models.CharField('Телефон', max_length=20, blank=True)
    email = models.EmailField('Email', blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='owned_stores',
        verbose_name='Владелец',
    )
    created_at = models.DateTimeField('Создан', auto_now_add=True)

    class Meta:
        verbose_name = 'Магазин'
        verbose_name_plural = 'Магазины'
        ordering = ['name']

    def __str__(self) -> str:
        return self.name
