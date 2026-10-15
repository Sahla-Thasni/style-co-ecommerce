from django.urls import include, path


# API URLs
urlpatterns = [
    path("auth/", include("apps.users.urls")),
    path("products/", include("apps.products.urls")),
    path("cart/", include("apps.cart.urls")),
    path("orders/", include("apps.orders.urls")),
]