from django.contrib import admin

from notifications.models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'message_short', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('title', 'message', 'user__username', 'user__email')
    list_editable = ('is_read',)
    list_select_related = ('user',)
    ordering = ('-created_at',)
    list_per_page = 30
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
    actions = ('mark_read', 'mark_unread')
    fieldsets = (
        ('Основное', {'fields': ('user', 'title', 'message', 'is_read')}),
        ('Служебная информация', {'fields': ('created_at',)}),
    )

    @admin.display(description='Сообщение')
    def message_short(self, obj):
        return (obj.message[:80] + '...') if len(obj.message) > 80 else obj.message

    @admin.action(description='Отметить как прочитанные')
    def mark_read(self, request, queryset):
        queryset.update(is_read=True)

    @admin.action(description='Отметить как непрочитанные')
    def mark_unread(self, request, queryset):
        queryset.update(is_read=False)
