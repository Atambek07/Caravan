from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.choices import UserRole
from caravan.permissions import IsAdmin, IsCustomer
from orders.models import Order
from orders.serializers import (
    OrderCreateSerializer,
    OrderSerializer,
    OrderStatusUpdateSerializer,
)
from orders.services import OrderService


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    filterset_fields = ['status']
    search_fields = ['id', 'customer__username', 'customer__email', 'store__name']
    ordering_fields = ['created_at', 'total_amount', 'status']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsCustomer()]
        user = self.request.user
        if user.role == UserRole.CUSTOMER:
            return [IsCustomer()]
        if user.role == UserRole.ADMIN:
            return [IsAdmin()]
        return [IsAdmin()]

    def get_queryset(self):
        qs = Order.objects.select_related('customer', 'store').prefetch_related(
            'items__product'
        )
        if self.request.user.role == UserRole.CUSTOMER:
            return qs.filter(customer=self.request.user)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            order = OrderService.create_order(
                customer=request.user,
                items_data=serializer.validated_data['items'],
                comment=serializer.validated_data.get('comment', ''),
            )
        except ValueError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED,
        )


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer

    def get_permissions(self):
        user = self.request.user
        if user.role == UserRole.CUSTOMER:
            return [IsCustomer()]
        return [IsAdmin()]

    def get_queryset(self):
        qs = Order.objects.select_related('customer', 'store').prefetch_related(
            'items__product'
        )
        if self.request.user.role == UserRole.CUSTOMER:
            return qs.filter(customer=self.request.user)
        return qs


class OrderStatusUpdateView(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'detail': 'Заказ не найден.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = OrderService.update_status(
            order, serializer.validated_data['status'], request.user
        )
        return Response(OrderSerializer(order).data)
