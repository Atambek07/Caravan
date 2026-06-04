"""SMS delivery service with console and HTTP providers."""
import json
import logging
import re

import requests
from django.conf import settings

logger = logging.getLogger('caravan')


def _normalize_phone(phone: str) -> str:
    digits = re.sub(r'\D', '', phone or '')
    if digits.startswith('8') and len(digits) == 11:
        digits = '7' + digits[1:]
    return digits


class SmsService:
    @staticmethod
    def send(phone: str, message: str) -> bool:
        phone = _normalize_phone(phone)
        if not phone:
            logger.warning('SMS skipped: empty phone')
            return False

        provider = settings.SMS_PROVIDER.lower()
        if provider == 'console' or not settings.SMS_ENABLED:
            logger.info('SMS [console] → %s: %s', phone, message)
            return True

        if provider == 'http':
            return SmsService._send_http(phone, message)

        logger.error('Unknown SMS provider: %s', provider)
        return False

    @staticmethod
    def send_to_user(user, message: str) -> bool:
        if not user.phone:
            return False
        return SmsService.send(user.phone, message)

    @staticmethod
    def _send_http(phone: str, message: str) -> bool:
        url = settings.SMS_API_URL
        token = settings.SMS_API_TOKEN
        sender = settings.SMS_SENDER
        if not url:
            logger.error('SMS_API_URL is not configured')
            return False
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'
        payload = {
            'phone': phone,
            'message': message,
            'sender': sender,
        }
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=15)
            response.raise_for_status()
            logger.info('SMS sent to %s via HTTP', phone)
            return True
        except requests.RequestException as exc:
            body = ''
            if exc.response is not None:
                try:
                    body = exc.response.text[:300]
                except Exception:
                    pass
            logger.error('SMS HTTP error for %s: %s %s', phone, exc, body)
            return False
