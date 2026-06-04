"""Custom API exception handling."""
import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger('caravan')


def custom_exception_handler(exc, context):
    """Log exceptions and return consistent error responses."""
    response = exception_handler(exc, context)
    if response is not None:
        if isinstance(response.data, dict) and 'detail' in response.data:
            response.data = {
                'detail': response.data['detail'],
                'errors': response.data,
            }
        return response

    logger.exception('Unhandled API exception: %s', exc)
    return Response(
        {'detail': 'Внутренняя ошибка сервера.'},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
