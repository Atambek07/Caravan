"""User admin configuration."""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from accounts.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        'username', 'full_name', 'email',
        'role', 'store', 'is_active', 'is_staff', 'created_at',
    )
    list_filter = ('role', 'is_active', 'is_staff', 'is_superuser', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')
    ordering = ('-created_at',)
    list_editable = ('is_active',)
    list_select_related = ('store',)
    list_per_page = 30
    save_on_top = True
    readonly_fields = ('created_at', 'updated_at', 'last_login', 'date_joined')
    empty_value_display = '—'
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Караван', {'fields': ('phone', 'role', 'store')}),
        ('Служебная информация', {'fields': ('created_at', 'updated_at')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Караван', {'fields': ('phone', 'role', 'store')}),
    )

    @admin.display(description='ФИО')
    def full_name(self, obj):
        full_name = f'{obj.first_name} {obj.last_name}'.strip()
        return full_name or '—'
