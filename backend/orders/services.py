"""Order business logic."""
import logging
from decimal import Decimal

from django.db import transaction

from accounts.choices import UserRole
from accounts.models import User
from notifications.services import NotificationService
from orders.models import Order, OrderItem, OrderStatus
from products.models import Product

logger = logging.getLogger('caravan')


class OrderService:
    """Create and update orders."""

    @staticmethod
    @transaction.atomic
    def create_order(customer: User, items_data: list[dict], comment: str = '') -> Order:
        if customer.role != UserRole.CUSTOMER:
            raise ValueError('Только заказчики могут оформлять заказы.')
        if not customer.store_id:
            raise ValueError('У пользователя не привязан магазин.')

        if not items_data:
            raise ValueError('Корзина пуста.')

        order = Order.objects.create(
            customer=customer,
            store=customer.store,
            status=OrderStatus.NEW,
            comment=comment,
            total_amount=Decimal('0.00'),
        )

        total = Decimal('0.00')
        for item in items_data:
            product_id = item['product_id']
            quantity = int(item['quantity'])
            product = Product.objects.select_for_update().get(pk=product_id)

            if not product.is_active:
                raise ValueError(f'Товар «{product.name}» недоступен.')
            if product.stock_quantity < quantity:
                raise ValueError(
                    f'Недостаточно остатка для «{product.name}». Доступно: {product.stock_quantity}.'
                )

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price,
            )
            product.stock_quantity -= quantity
            product.save(update_fields=['stock_quantity'])
            total += product.price * quantity

        order.total_amount = total
        order.save(update_fields=['total_amount'])

        admins = User.objects.filter(role=UserRole.ADMIN, is_active=True)
        for admin in admins:
            NotificationService.notify_new_order(admin, order)

        logger.info('Order #%s created by %s, total=%s', order.pk, customer.username, total)
        return order

    @staticmethod
    @transaction.atomic
    def update_status(order: Order, new_status: str, actor: User) -> Order:
        old_status = order.status
        if old_status == new_status:
            return order

        order.status = new_status
        order.save(update_fields=['status', 'updated_at'])

        NotificationService.notify_status_change(order.customer, order, old_status, new_status)
        logger.info(
            'Order #%s status %s -> %s by %s',
            order.pk, old_status, new_status, actor.username,
        )
        return order
