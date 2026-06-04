from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.choices import UserRole
from caravan.permissions import IsAdmin, IsCustomer
from dashboard.services import DashboardService


class AdminDashboardView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        return Response(DashboardService.admin_dashboard())


class CustomerDashboardView(APIView):
    permission_classes = [IsCustomer]

    def get(self, request):
        return Response(DashboardService.customer_dashboard(request.user))


class ProductManagerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in (UserRole.ADMIN, UserRole.PRODUCT_MANAGER):
            return Response({'detail': 'Доступ запрещён.'}, status=403)
        from products.models import Category, Product
        return Response({
            'cards': {
                'products_count': Product.objects.count(),
                'active_products': Product.objects.filter(is_active=True).count(),
                'categories_count': Category.objects.count(),
                'low_stock': Product.objects.filter(stock_quantity__lt=10, is_active=True).count(),
            },
        })
