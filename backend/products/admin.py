from django.contrib import admin
from django.utils.html import format_html

from products.models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description_short', 'image_preview', 'created_at')
    search_fields = ('name', 'description')
    list_display_links = ('name',)
    ordering = ('name',)

    @admin.display(description='Описание')
    def description_short(self, obj):
        return (obj.description[:80] + '...') if len(obj.description) > 80 else obj.description

    @admin.display(description='Фото')
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />', obj.image.url)
        return '—'


class ProductInline(admin.TabularInline):
    model = Product
    extra = 0
    fields = ('name', 'article', 'price', 'stock_quantity', 'is_active')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'article', 'category', 'price', 'stock_quantity',
        'is_active', 'image_preview', 'updated_at',
    )
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'article', 'description')
    list_editable = ('price', 'stock_quantity', 'is_active')
    ordering = ('name',)
    autocomplete_fields = ('category',)
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
            return format_html('<img src="{}" width="50" height="50" />', obj.image.url)
        return '—'


CategoryAdmin.inlines = [ProductInline]
