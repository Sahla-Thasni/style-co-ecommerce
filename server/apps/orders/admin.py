from django.contrib import admin

from .models import Order, OrderItem


# Order admin
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "status",
        "subtotal",
        "discount",
        "delivery_fee",
        "total",
        "created_at",
    )

    search_fields = (
        "user__email",
    )

    list_filter = (
        "status",
    )

    ordering = (
        "-created_at",
    )


# Order item admin
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "order",
        "product_name",
        "price",
        "quantity",
    )

    search_fields = (
        "product_name",
        "order__user__email",
    )