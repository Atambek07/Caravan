"""Password reset helpers."""
import logging

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

from accounts.models import User
from caravan.messaging.email_service import EmailService

logger = logging.getLogger('caravan')


class PasswordResetService:
    @staticmethod
    def build_reset_link(user: User) -> str:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        base = settings.FRONTEND_URL.rstrip('/')
        return f'{base}/password-reset/confirm?uid={uid}&token={token}'

    @staticmethod
    def send_reset_email(user: User) -> bool:
        link = PasswordResetService.build_reset_link(user)
        subject = 'Восстановление пароля — Караван'
        body = (
            f'Здравствуйте, {user.get_full_name() or user.username}!\n\n'
            f'Вы запросили восстановление пароля на платформе «Караван».\n'
            f'Перейдите по ссылке для установки нового пароля:\n\n'
            f'{link}\n\n'
            f'Если вы не запрашивали сброс пароля, проигнорируйте это письмо.\n'
            f'Ссылка действует ограниченное время.\n\n'
            f'— Команда Караван'
        )
        return EmailService.send(user.email, subject, body)

    @staticmethod
    def validate_token(uid: str, token: str) -> User | None:
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id, is_active=True)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return None
        if not default_token_generator.check_token(user, token):
            return None
        return user

    @staticmethod
    def reset_password(user: User, new_password: str) -> None:
        user.set_password(new_password)
        user.save(update_fields=['password'])
