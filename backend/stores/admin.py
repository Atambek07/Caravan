from django.contrib import admin

from stores.models import Store


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'phone', 'email', 'owner', 'created_at')
    search_fields = ('name', 'address', 'email', 'phone')
    list_filter = ('created_at',)
    autocomplete_fields = ('owner',)
