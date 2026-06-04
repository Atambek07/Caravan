"""Create default admin user from environment variables."""
import os

from django.core.management.base import BaseCommand

from accounts.choices import UserRole
from accounts.models import User


class Command(BaseCommand):
    help = 'Create default admin user if not exists'

    def handle(self, *args, **options):
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@caravan.local')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin12345')

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'Admin "{username}" already exists'))
            return

        User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            role=UserRole.ADMIN,
        )
        self.stdout.write(self.style.SUCCESS(f'Admin "{username}" created successfully'))
