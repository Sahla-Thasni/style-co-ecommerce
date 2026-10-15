from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    ListAPIView,
)

from django.db.models import Sum, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAuthenticatedOrReadOnly,
    IsAuthenticated
)

from .models import (
    Brand,
    Category,
    Product,
    ProductReview,
)
from .serializers import (
    CategorySerializer,
    BrandSerializer,
    ProductSerializer,
    ProductReviewSerializer,
)

from apps.orders.models import OrderItem

#Category list view
class CategoryListView(ListAPIView):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer

# Brand list view
class BrandListView(ListAPIView):
    queryset = Brand.objects.all().order_by("name")
    serializer_class = BrandSerializer


# Product list and create view
class ProductListCreateView(ListCreateAPIView):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = [
        "name",
        "description",
        "category__name",
        "brand__name",
    ]

# Product detail view
class ProductDetailView(RetrieveUpdateDestroyAPIView):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer


#Product review view
class ProductReviewListCreateView(ListCreateAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return ProductReview.objects.filter(
            product_id=self.kwargs["product_id"]
        ).select_related("user")

    def perform_create(self, serializer):
        product_id = self.kwargs["product_id"]

        has_purchased = OrderItem.objects.filter(
            order__user=self.request.user,
            order__status="delivered",
            variant__product_id=product_id,
        ).exists()

        if not has_purchased:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied()

        serializer.save(
            user=self.request.user,
            product_id=product_id,
        )


class ProductReviewEligibilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, product_id):
        has_purchased = OrderItem.objects.filter(
            order__user=request.user,
            order__status="delivered",
            variant__product_id=product_id,
        ).exists()

        return Response({
            "can_review": has_purchased,
        })   


class TopSellingProductListView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return (
            Product.objects
            .filter(is_active=True)
            .annotate(
                total_sold=Sum(
                    "variants__order_items__quantity",
                    filter=Q(
                        variants__order_items__order__status="delivered"
                    ),
                )
            )
            .filter(total_sold__gt=0)
            .order_by("-total_sold")
        )        
