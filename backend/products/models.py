"""Product and category models."""
from django.db import models


def category_image_path(instance, filename: str) -> str:
    return f'categories/{instance.id or "new"}_{filename}'


def product_image_path(instance, filename: str) -> str:
    return f'products/{instance.id or "new"}_{filename}'


class Category(models.Model):
    name = models.CharField('Название', max_length=255)
    description = models.TextField('Описание', blank=True)
    image = models.ImageField('Изображение', upload_to=category_image_path, blank=True, null=True)
    created_at = models.DateTimeField('Создана', auto_now_add=True)

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name='Категория',
    )
    name = models.CharField('Название', max_length=255)
    article = models.CharField('Артикул', max_length=100, unique=True)
    description = models.TextField('Описание', blank=True)
    image = models.ImageField('Изображение', upload_to=product_image_path, blank=True, null=True)
    price = models.DecimalField('Цена', max_digits=12, decimal_places=2)
    stock_quantity = models.PositiveIntegerField('Остаток', default=0)
    is_active = models.BooleanField('Активен', default=True)
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлён', auto_now=True)

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        ordering = ['name']

    def __str__(self) -> str:
        return f'{self.name} ({self.article})'
