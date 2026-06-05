from django.contrib import admin
from django.utils.html import format_html

from products.models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description_short', 'image_preview', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)
    list_display_links = ('name',)
    ordering = ('name',)
    list_per_page = 30
    readonly_fields = ('image_preview', 'created_at')
    fieldsets = (
        ('Основное', {'fields': ('name', 'description')}),
        ('Медиа', {'fields': ('image', 'image_preview')}),
        ('Служебная информация', {'fields': ('created_at',)}),
    )

    @admin.display(description='Описание')
    def description_short(self, obj):
        if not obj.description:
            return '—'
        return (obj.description[:80] + '...') if len(obj.description) > 80 else obj.description

    @admin.display(description='Фото')
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="56" height="56" style="border-radius:8px; object-fit:cover;" />',
                obj.image.url,
            )
        return '—'


class ProductInline(admin.TabularInline):
    model = Product
    extra = 0
    fields = ('name', 'article', 'price', 'stock_quantity', 'is_active')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'article', 'category', 'price', 'stock_quantity',
        'is_active', 'stock_state', 'image_preview', 'updated_at',
    )
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'article', 'description')
    list_editable = ('price', 'stock_quantity', 'is_active')
    ordering = ('name',)
    autocomplete_fields = ('category',)
    list_select_related = ('category',)
    list_per_page = 30
    save_on_top = True
    readonly_fields = ('image_preview', 'created_at', 'updated_at')
    fieldsets = (
        ('Основное', {'fields': ('name', 'article', 'category', 'description')}),
        ('Цена и склад', {'fields': ('price', 'stock_quantity', 'is_active')}),
        ('Медиа', {'fields': ('image', 'image_preview')}),
        ('Служебная информация', {'fields': ('created_at', 'updated_at')}),
    )
    actions = ['activate_products', 'deactivate_products']

    @admin.action(description='Активировать выбранные')
    def activate_products(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description='Деактивировать выбранные')
    def deactivate_products(self, request, queryset):
        queryset.update(is_active=False)

    @admin.display(description='Фото')
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="56" height="56" style="border-radius:8px; object-fit:cover;" />',
                obj.image.url,
            )
        return '—'

    @admin.display(description='Склад')
    def stock_state(self, obj):
        if obj.stock_quantity == 0:
            return format_html('<span style="color:#b91c1c; font-weight:600;">Нет в наличии</span>')
        if obj.stock_quantity < 10:
            return format_html('<span style="color:#b45309; font-weight:600;">Мало</span>')
        return format_html('<span style="color:#166534; font-weight:600;">В наличии</span>')


CategoryAdmin.inlines = [ProductInline]
