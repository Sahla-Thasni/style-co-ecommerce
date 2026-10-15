from rest_framework import serializers

from .models import Cart, CartItem
from apps.products.models import ProductVariant


# Cart item serializer
class CartItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="variant.product.name",
        read_only=True
    )

    color = serializers.CharField(
        source="variant.color",
        read_only=True
    )

    size = serializers.CharField(
        source="variant.size",
        read_only=True
    )

    price = serializers.DecimalField(
    source="variant.product.discount_price",
    max_digits=10,
    decimal_places=2,
    read_only=True
    )

    image = serializers.URLField(
    source="variant.product.images.first.image",
    read_only=True
    )

    class Meta:
        model = CartItem
        fields = (
            "id",
            "variant",
            "product_name",
            "color",
            "size",
            "price",
            "image",
            "quantity",
        )


# Cart serializer
class CartSerializer(serializers.ModelSerializer):

    items = CartItemSerializer(
        many=True,
        read_only=True
    )

    subtotal = serializers.SerializerMethodField()
    discount = serializers.SerializerMethodField()
    delivery_fee = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    # Calculate cart subtotal
    def get_subtotal(self, obj):
        total = 0

        for item in obj.items.all():
            total += item.variant.product.discount_price * item.quantity

        return total


    # Calculate cart discount
    def get_discount(self, obj):
        total = 0

        for item in obj.items.all():
            product = item.variant.product

            discount = (
                product.unit_price - product.discount_price
            )

            total += discount * item.quantity

        return total

    # Calculate delivery fee
    def get_delivery_fee(self, obj):
        subtotal = self.get_subtotal(obj)

        if subtotal == 0:
            return 0

        if subtotal >= 500:
            return 0

        return 25

    # Calculate final cart total
    def get_total(self, obj):
        subtotal = self.get_subtotal(obj)
        discount = self.get_discount(obj)
        delivery_fee = self.get_delivery_fee(obj)

        return subtotal - discount + delivery_fee        


    class Meta:
        model = Cart
        fields = (
            "id",
            "items",
            "subtotal",
            "discount",
            "delivery_fee",
            "total",
            "created_at",
            "updated_at",
        )
    
# Add to cart serializer
class AddToCartSerializer(serializers.Serializer):

    variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all()
    )

    quantity = serializers.IntegerField(
        min_value=1
    )

# Update cart item serializer
class UpdateCartItemSerializer(serializers.Serializer):

    quantity = serializers.IntegerField(
        min_value=1
    )