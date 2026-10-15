from rest_framework import serializers

from .models import Order, OrderItem


# Order item serializer
class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product_name",
            "price",
            "quantity",
        )


# Order serializer
class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Order
        fields = (
            "id",
            "full_name",
            "phone",
            "address",
            "city",
            "emirate",
            "postal_code",
            "payment_method",
            "status",
            "subtotal",
            "discount",
            "delivery_fee",
            "total",
            "items",
            "created_at",
            "updated_at",
        )

# Checkout request serializer
class CheckoutSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=200)
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    emirate = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)

    payment_method = serializers.ChoiceField(
        choices=("cod", "card")
    )
    
    promo_code = serializers.CharField(
    max_length=50,
    required=False,
    allow_blank=True
    )

#status update serializer
class OrderStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=Order.STATUS_CHOICES
    )
