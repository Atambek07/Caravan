from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html

from orders.models import Order, OrderItem, OrderStatus


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price', 'subtotal')
    can_delete = False
    fields = ('product', 'quantity', 'price', 'subtotal')

    @admin.display(description='Сумма')
    def subtotal(self, obj):
        return obj.subtotal


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'customer', 'store', 'status_badge', 'total_amount',
        'items_count', 'created_at', 'updated_at',
    )
    list_filter = ('status', ('created_at', admin.DateFieldListFilter))
    search_fields = (
        'id', 'customer__username', 'customer__email',
        'customer__first_name', 'customer__last_name', 'store__name',
    )
    readonly_fields = ('total_amount', 'created_at', 'updated_at')
    inlines = [OrderItemInline]
    date_hierarchy = 'created_at'
    list_select_related = ('customer', 'store')
    autocomplete_fields = ('customer', 'store')
    list_per_page = 30
    save_on_top = True
    actions = [
        'mark_confirmed', 'mark_processing', 'mark_ready',
        'mark_shipped', 'mark_delivered', 'mark_canceled',
    ]
    fieldsets = (
        ('Основное', {'fields': ('customer', 'store', 'status')}),
        ('Детали', {'fields': ('comment',)}),
        ('Сумма и даты', {'fields': ('total_amount', 'created_at', 'updated_at')}),
    )

    @admin.display(description='Статус')
    def status_badge(self, obj):
        colors = {
            OrderStatus.NEW: '#1d4ed8',
            OrderStatus.CONFIRMED: '#4f46e5',
            OrderStatus.PROCESSING: '#b45309',
            OrderStatus.READY_TO_SHIP: '#7c3aed',
            OrderStatus.SHIPPED: '#0369a1',
            OrderStatus.DELIVERED: '#166534',
            OrderStatus.CANCELED: '#b91c1c',
        }
        color = colors.get(obj.status, '#374151')
        return format_html(
            '<span style="font-weight:600; color:{};">{}</span>',
            color,
            obj.get_status_display(),
        )

    @admin.display(description='Позиций')
    def items_count(self, obj):
        return obj.items.count()

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
