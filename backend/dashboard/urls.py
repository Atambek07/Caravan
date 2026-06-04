from django.urls import path

from dashboard.views import (
    AdminDashboardView,
    CustomerDashboardView,
    ProductManagerDashboardView,
)

urlpatterns = [
    path('admin/', AdminDashboardView.as_view(), name='dashboard-admin'),
    path('customer/', CustomerDashboardView.as_view(), name='dashboard-customer'),
    path('manager/', ProductManagerDashboardView.as_view(), name='dashboard-manager'),
]
