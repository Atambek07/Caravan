"""Order models."""
from decimal import Decimal

from django.conf import settings
from django.db import models


class OrderStatus(models.TextChoices):
    NEW = 'NEW', 'Новый'
    CONFIRMED = 'CONFIRMED', 'Подтверждён'
    PROCESSING = 'PROCESSING', 'В обработке'
    READY_TO_SHIP = 'READY_TO_SHIP', 'Готов к отгрузке'
    SHIPPED = 'SHIPPED', 'Отправлен'
    DELIVERED = 'DELIVERED', 'Доставлен'
    CANCELED = 'CANCELED', 'Отменён'


class Order(models.Model):
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='orders',
        verbose_name='Заказчик',
    )
    store = models.ForeignKey(
        'stores.Store',
        on_delete=models.PROTECT,
        related_name='orders',
        verbose_name='Магазин',
    )
    status = models.CharField(
        'Статус',
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.NEW,
    )
    total_amount = models.DecimalField(
        'Сумма',
        max_digits=14,
        decimal_places=2,
        default=Decimal('0.00'),
    )
    comment = models.TextField('Комментарий', blank=True)
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлён', auto_now=True)

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'Заказ #{self.pk} — {self.get_status_display()}'


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Заказ',
    )
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.PROTECT,
        related_name='order_items',
        verbose_name='Товар',
    )
    quantity = models.PositiveIntegerField('Количество')
    price = models.DecimalField('Цена', max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = 'Позиция заказа'
        verbose_name_plural = 'Позиции заказа'

    def __str__(self) -> str:
        return f'{self.product.name} x{self.quantity}'

    @property
    def subtotal(self) -> Decimal:
        return self.price * self.quantity
