"""User admin configuration."""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from accounts.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        'username', 'email', 'first_name', 'last_name',
        'role', 'store', 'is_active', 'created_at',
    )
    list_filter = ('role', 'is_active', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')
    ordering = ('-created_at',)
    list_editable = ('is_active',)
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Караван', {'fields': ('phone', 'role', 'store')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Караван', {'fields': ('phone', 'role', 'store')}),
    )
