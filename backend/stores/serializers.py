from rest_framework import serializers

from stores.models import Store


class StoreSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True, default=None)
    customers_count = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = (
            'id', 'name', 'address', 'phone', 'email',
            'owner', 'owner_username', 'customers_count', 'created_at',
        )
        read_only_fields = ('id', 'created_at')

    def get_customers_count(self, obj) -> int:
        return obj.customers.count()
