from django.contrib import admin

from stores.models import Store


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'address_short', 'phone', 'email',
        'owner', 'customers_count', 'created_at',
    )
    search_fields = ('name', 'address', 'email', 'phone', 'owner__username', 'owner__email')
    list_filter = ('created_at',)
    autocomplete_fields = ('owner',)
    list_select_related = ('owner',)
    ordering = ('name',)
    list_per_page = 30
    readonly_fields = ('created_at', 'customers_count')
    fieldsets = (
        ('Основное', {'fields': ('name', 'owner')}),
        ('Контакты', {'fields': ('address', 'phone', 'email')}),
        ('Служебная информация', {'fields': ('customers_count', 'created_at')}),
    )

    @admin.display(description='Адрес')
    def address_short(self, obj):
        return (obj.address[:60] + '...') if len(obj.address) > 60 else obj.address

    @admin.display(description='Клиентов')
    def customers_count(self, obj):
        return obj.customers.count()
