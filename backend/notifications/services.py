"""Notification creation helpers."""
import logging

from django.conf import settings

from caravan.messaging.email_service import EmailService
from caravan.messaging.sms_service import SmsService
from orders.models import Order

logger = logging.getLogger('caravan')


class NotificationService:
    @staticmethod
    def create(user, title: str, message: str):
        from notifications.models import Notification
        return Notification.objects.create(user=user, title=title, message=message)

    @staticmethod
    def _send_external(user, subject: str, body: str, sms_text: str | None = None) -> None:
        if settings.NOTIFY_EMAIL and user.email:
            EmailService.send_to_user(user, subject, body)
        if settings.NOTIFY_SMS and sms_text and user.phone:
            SmsService.send_to_user(user, sms_text)

    @staticmethod
    def notify_new_order(admin_user, order: Order):
        title = 'Новый заказ'
        message = (
            f'Поступил заказ #{order.pk} от {order.store.name} '
            f'на сумму {order.total_amount} ₸.'
        )
        NotificationService.create(admin_user, title=title, message=message)

        email_body = (
            f'Здравствуйте!\n\n'
            f'Поступил новый заказ #{order.pk}.\n'
            f'Магазин: {order.store.name}\n'
            f'Клиент: {order.customer.get_full_name() or order.customer.username}\n'
            f'Сумма: {order.total_amount} ₸\n'
            f'Комментарий: {order.comment or "—"}\n\n'
            f'Обработайте заказ в панели администратора.\n\n'
            f'— Караван'
        )
        sms = f'Караван: новый заказ #{order.pk} от {order.store.name}, {order.total_amount} ₸'
        NotificationService._send_external(admin_user, title, email_body, sms)

    @staticmethod
    def notify_status_change(customer, order: Order, old_status: str, new_status: str):
        status_labels = dict(order._meta.get_field('status').choices)
        old_label = status_labels.get(old_status, old_status)
        new_label = status_labels.get(new_status, new_status)
        title = 'Статус заказа изменён'
        message = f'Заказ #{order.pk}: {old_label} → {new_label}.'
        NotificationService.create(customer, title=title, message=message)

        email_body = (
            f'Здравствуйте, {customer.get_full_name() or customer.username}!\n\n'
            f'Статус вашего заказа #{order.pk} изменён:\n'
            f'{old_label} → {new_label}\n'
            f'Сумма: {order.total_amount} ₸\n\n'
            f'Подробности — в личном кабинете «Караван».\n\n'
            f'— Караван'
        )
        sms = f'Караван: заказ #{order.pk} — {new_label}. Сумма {order.total_amount} ₸'
        NotificationService._send_external(customer, title, email_body, sms)

    @staticmethod
    def notify_system(user, title: str, message: str):
        NotificationService.create(user, title=title, message=message)
        NotificationService._send_external(user, title, message, message[:160])
