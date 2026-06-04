from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from accounts.choices import UserRole
from caravan.permissions import IsAdminOrReadOnly, IsProductManager
from products.models import Category, Product
from products.serializers import CategorySerializer, ProductSerializer


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsProductManager]


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'article', 'description']
    ordering_fields = ['name', 'price', 'stock_quantity', 'created_at']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsProductManager()]
        if self.request.method == 'GET':
            user = self.request.user
            if user.role == UserRole.CUSTOMER:
                return [IsAuthenticated()]
            return [IsAdminOrReadOnly()]
        return super().get_permissions()

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.role == UserRole.CUSTOMER:
            return qs.filter(is_active=True, stock_quantity__gt=0)
        return qs


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsProductManager()]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.role == UserRole.CUSTOMER:
            return qs.filter(is_active=True)
        return qs
