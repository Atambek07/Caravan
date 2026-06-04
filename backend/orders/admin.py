from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html

from orders.models import Order, OrderItem, OrderStatus


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price')
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'customer', 'store', 'status', 'total_amount',
        'created_at', 'updated_at',
    )
    list_filter = ('status', ('created_at', admin.DateFieldListFilter))
    search_fields = (
        'id', 'customer__username', 'customer__email',
        'customer__first_name', 'customer__last_name', 'store__name',
    )
    readonly_fields = ('total_amount', 'created_at', 'updated_at')
    inlines = [OrderItemInline]
    date_hierarchy = 'created_at'
    actions = [
        'mark_confirmed', 'mark_processing', 'mark_ready',
        'mark_shipped', 'mark_delivered', 'mark_canceled',
    ]

    @admin.action(description='Подтвердить')
    def mark_confirmed(self, request, queryset):
        queryset.update(status=OrderStatus.CONFIRMED, updated_at=timezone.now())

    @admin.action(description='В обработку')
    def mark_processing(self, request, queryset):
        queryset.update(status=OrderStatus.PROCESSING, updated_at=timezone.now())

    @admin.action(description='Готов к отгрузке')
    def mark_ready(self, request, queryset):
        queryset.update(status=OrderStatus.READY_TO_SHIP, updated_at=timezone.now())

    @admin.action(description='Отправлен')
    def mark_shipped(self, request, queryset):
        queryset.update(status=OrderStatus.SHIPPED, updated_at=timezone.now())

    @admin.action(description='Доставлен')
    def mark_delivered(self, request, queryset):
        queryset.update(status=OrderStatus.DELIVERED, updated_at=timezone.now())

    @admin.action(description='Отменить')
    def mark_canceled(self, request, queryset):
        queryset.update(status=OrderStatus.CANCELED, updated_at=timezone.now())
