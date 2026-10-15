from decimal import Decimal

from django.db import transaction
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from apps.cart.models import Cart

from .models import Order, OrderItem
from .serializers import (
    OrderSerializer,
    CheckoutSerializer,
    OrderStatusUpdateSerializer,
)

# User order history
class OrderListView(ListAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        ).order_by("-created_at")
        

# Checkout view
class CheckoutView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        # Validate checkout details
        serializer = CheckoutSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        checkout_data = serializer.validated_data

        try:
            cart = Cart.objects.get(
                user=request.user
            )
        except Cart.DoesNotExist:
            return Response(
                {"message": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_items = cart.items.all()

        if not cart_items.exists():
            return Response(
                {"message": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        subtotal = 0
        product_discount = 0

        for item in cart_items:
            product = item.variant.product

            # Calculate original-price subtotal
            subtotal += (
                product.unit_price * item.quantity
            )

            # Calculate product sale discount
            product_discount += (
                (product.unit_price - product.discount_price)
                * item.quantity
            )

        # Calculate price after product discount
        sale_total = subtotal - product_discount

        # Apply FIRST20 only for the first order
        first_order_discount = 0

        promo_code = checkout_data.get(
            "promo_code",
            ""
        ).strip().upper()

        if promo_code == "FIRST20":

            if Order.objects.filter(
                user=request.user
            ).exists():
                return Response(
                    {
                        "message": "FIRST20 is valid only for your first order."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            first_order_discount = (
                sale_total * Decimal("0.20")
            )
            
        # Calculate total discount
        discount = (
            product_discount +
            first_order_discount
        )

        # Free delivery for orders of 500 or more
        delivery_fee = 0 if subtotal >= 500 else 25

        # Calculate final total
        total = (
            subtotal
            - discount
            + delivery_fee
        )

        order = Order.objects.create(
            user=request.user,
            full_name=checkout_data["full_name"],
            phone=checkout_data["phone"],
            address=checkout_data["address"],
            city=checkout_data["city"],
            emirate=checkout_data["emirate"],
            postal_code=checkout_data["postal_code"],
            payment_method=checkout_data["payment_method"],
            subtotal=subtotal,
            discount=discount,
            delivery_fee=delivery_fee,
            total=total
        )

        for item in cart_items:
            product = item.variant.product

            OrderItem.objects.create(
                order=order,
                variant=item.variant,
                product_name=product.name,
                price=product.discount_price,
                quantity=item.quantity
            )

        cart_items.delete()

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


#status update view
class OrderStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = OrderStatusUpdateSerializer(
            data=request.data
        )

        if serializer.is_valid():
            order.status = serializer.validated_data["status"]
            order.save(update_fields=["status", "updated_at"])

            return Response(
                OrderSerializer(order).data,
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )