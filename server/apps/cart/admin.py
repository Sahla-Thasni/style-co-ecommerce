from django.contrib import admin

from .models import Cart, CartItem


# Cart admin
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "user__email",
    )


# Cart item admin
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "cart",
        "variant",
        "quantity",
    )

    search_fields = (
        "cart__user__email",
        "variant__product__name",
    )

    list_filter = (
        "variant__color",
        "variant__size",
    )