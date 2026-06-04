"""Email delivery service."""
import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger('caravan')


class EmailService:
    @staticmethod
    def send(to: str, subject: str, body: str) -> bool:
        if not to:
            logger.warning('Email skipped: empty recipient')
            return False
        try:
            send_mail(
                subject=subject,
                message=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[to],
                fail_silently=False,
            )
            logger.info('Email sent to %s: %s', to, subject)
            return True
        except Exception as exc:
            logger.error('Failed to send email to %s: %s', to, exc)
            return False

    @staticmethod
    def send_to_user(user, subject: str, body: str) -> bool:
        if not user.email:
            return False
        return EmailService.send(user.email, subject, body)
