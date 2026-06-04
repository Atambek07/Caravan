"""Seed demo categories and products."""
from decimal import Decimal

from django.core.management.base import BaseCommand

from products.models import Category, Product


class Command(BaseCommand):
    help = 'Seed demo categories and products'

    def handle(self, *args, **options):
        if Product.objects.exists():
            self.stdout.write(self.style.WARNING('Demo data already exists'))
            return

        categories = [
            ('Напитки', 'Соки, вода, газировка'),
            ('Бакалея', 'Крупы, макароны, мука'),
            ('Консервы', 'Овощные и мясные консервы'),
            ('Снеки', 'Чипсы, орехи, сухарики'),
        ]
        cat_objs = []
        for name, desc in categories:
            cat_objs.append(Category.objects.create(name=name, description=desc))

        products = [
            (cat_objs[0], 'Сок апельсиновый 1л', 'DRK-001', Decimal('450'), 500),
            (cat_objs[0], 'Вода минеральная 0.5л', 'DRK-002', Decimal('180'), 1000),
            (cat_objs[1], 'Рис длиннозёрный 1кг', 'GRC-001', Decimal('890'), 300),
            (cat_objs[1], 'Макароны 400г', 'GRC-002', Decimal('420'), 600),
            (cat_objs[2], 'Тушёнка говяжья 325г', 'CNS-001', Decimal('1850'), 150),
            (cat_objs[2], 'Горошек зелёный 400г', 'CNS-002', Decimal('650'), 400),
            (cat_objs[3], 'Чипсы картофельные 150г', 'SNK-001', Decimal('750'), 800),
            (cat_objs[3], 'Арахис жареный 200г', 'SNK-002', Decimal('980'), 250),
        ]
        for cat, name, article, price, stock in products:
            Product.objects.create(
                category=cat,
                name=name,
                article=article,
                description=f'Качественный товар: {name}',
                price=price,
                stock_quantity=stock,
                is_active=True,
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(cat_objs)} categories and {len(products)} products'))
