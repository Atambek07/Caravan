"""Dashboard statistics."""
from datetime import timedelta
from decimal import Decimal

from django.db.models import Count, Sum
from django.db.models.functions import TruncDate, TruncMonth
from django.utils import timezone

from accounts.choices import UserRole
from accounts.models import User
from orders.models import Order, OrderItem, OrderStatus
from products.models import Product


class DashboardService:
    @staticmethod
    def admin_dashboard():
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

        orders_qs = Order.objects.exclude(status=OrderStatus.CANCELED)
        total_orders = orders_qs.count()
        total_customers = User.objects.filter(role=UserRole.CUSTOMER, is_active=True).count()
        total_products = Product.objects.filter(is_active=True).count()
        total_revenue = orders_qs.aggregate(total=Sum('total_amount'))['total'] or Decimal('0')

        sales_by_day = list(
            orders_qs.filter(created_at__gte=thirty_days_ago)
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(amount=Sum('total_amount'), count=Count('id'))
            .order_by('date')
        )
        for row in sales_by_day:
            row['date'] = row['date'].isoformat() if row['date'] else None
            row['amount'] = float(row['amount'] or 0)

        orders_by_month = list(
            orders_qs.annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')[:12]
        )
        for row in orders_by_month:
            row['month'] = row['month'].strftime('%Y-%m') if row['month'] else None

        popular_products = list(
            OrderItem.objects.values('product__name', 'product__id')
            .annotate(total_qty=Sum('quantity'))
            .order_by('-total_qty')[:10]
        )

        new_customers = list(
            User.objects.filter(role=UserRole.CUSTOMER, created_at__gte=thirty_days_ago)
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )
        for row in new_customers:
            row['date'] = row['date'].isoformat() if row['date'] else None

        recent_orders = Order.objects.select_related('customer', 'store').order_by(
            '-created_at'
        )[:20]

        from orders.serializers import OrderSerializer

        return {
            'cards': {
                'orders_count': total_orders,
                'customers_count': total_customers,
                'products_count': total_products,
                'total_revenue': float(total_revenue),
            },
            'charts': {
                'sales_by_day': sales_by_day,
                'orders_by_month': orders_by_month,
                'popular_products': [
                    {
                        'product_id': p['product__id'],
                        'name': p['product__name'],
                        'quantity': p['total_qty'],
                    }
                    for p in popular_products
                ],
                'new_customers': new_customers,
            },
            'recent_orders': OrderSerializer(recent_orders, many=True).data,
        }

    @staticmethod
    def customer_dashboard(user):
        orders_qs = Order.objects.filter(customer=user)
        return {
            'cards': {
                'orders_count': orders_qs.count(),
                'active_orders': orders_qs.exclude(
                    status__in=[OrderStatus.DELIVERED, OrderStatus.CANCELED]
                ).count(),
                'total_spent': float(
                    orders_qs.exclude(status=OrderStatus.CANCELED).aggregate(
                        t=Sum('total_amount')
                    )['t'] or 0
                ),
            },
            'recent_orders': list(
                orders_qs.select_related('store').order_by('-created_at')[:10].values(
                    'id', 'status', 'total_amount', 'created_at', 'store__name'
                )
            ),
        }
