from django.urls import path

from .views import (
    OrderListView,
    CheckoutView,
    OrderStatusUpdateView
)


# Order URLs
urlpatterns = [
    path( "", OrderListView.as_view(), name="order-list"),
    path( "checkout/", CheckoutView.as_view(), name="checkout"),
    path( "<int:pk>/status/", OrderStatusUpdateView.as_view(), name="order-status-update",),
]