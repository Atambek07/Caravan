from rest_framework import generics

from caravan.permissions import IsAdmin
from stores.models import Store
from stores.serializers import StoreSerializer


class StoreListCreateView(generics.ListCreateAPIView):
    queryset = Store.objects.select_related('owner').all()
    serializer_class = StoreSerializer
    permission_classes = [IsAdmin]
    search_fields = ['name', 'address', 'email', 'phone']
    ordering_fields = ['name', 'created_at']


class StoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Store.objects.select_related('owner').all()
    serializer_class = StoreSerializer
    permission_classes = [IsAdmin]
