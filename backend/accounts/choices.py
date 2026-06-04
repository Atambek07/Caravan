from django.db import models


class UserRole(models.TextChoices):
    ADMIN = 'ADMIN', 'Администратор'
    PRODUCT_MANAGER = 'PRODUCT_MANAGER', 'Менеджер товаров'
    CUSTOMER = 'CUSTOMER', 'Заказчик'
