from rest_framework.generics import RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Cart, CartItem
from .serializers import (
    CartSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
)


# Get user's cart
class CartDetailView(RetrieveAPIView):

    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(
            user=self.request.user
        )

        return cart

# Add product variant to cart
class AddToCartView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(
            data=request.data
        )

        if serializer.is_valid():
            variant = serializer.validated_data["variant"]
            quantity = serializer.validated_data["quantity"]

            cart, created = Cart.objects.get_or_create(
                user=request.user
            )

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                variant=variant
            )

            if created:
                new_quantity = quantity
            else:
                new_quantity = cart_item.quantity + quantity

            if new_quantity > variant.stock:
                return Response(
                    {"message": "Not enough stock available"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            cart_item.quantity = new_quantity
            cart_item.save()

            return Response(
                {
                    "message": "Product added to cart successfully"
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

# Remove cart item
class RemoveCartItemView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            cart_item = CartItem.objects.get(
                id=pk,
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {"message": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item.delete()

        return Response(
            {"message": "Cart item removed successfully"},
            status=status.HTTP_204_NO_CONTENT
        )

# Update cart item quantity
class UpdateCartItemView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            cart_item = CartItem.objects.get(
                id=pk,
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {"message": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UpdateCartItemSerializer(
            cart_item,
            data=request.data
        )

        if serializer.is_valid():
            quantity = serializer.validated_data["quantity"]

            if quantity > cart_item.variant.stock:
                return Response(
                     {"message": "Not enough stock available"},
                     status=status.HTTP_400_BAD_REQUEST
                )
                     
            cart_item.quantity = serializer.validated_data["quantity"]
            cart_item.save()

            return Response(
                {"message": "Cart quantity updated successfully"},
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )             