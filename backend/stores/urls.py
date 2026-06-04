from django.urls import path

from stores.views import StoreDetailView, StoreListCreateView

urlpatterns = [
    path('', StoreListCreateView.as_view(), name='store-list'),
    path('<int:pk>/', StoreDetailView.as_view(), name='store-detail'),
]
