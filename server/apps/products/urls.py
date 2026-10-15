from django.urls import path

from .views import (
    ProductListCreateView,
    ProductDetailView,
    BrandListView,
    CategoryListView,
    ProductReviewListCreateView,
    ProductReviewEligibilityView,
    TopSellingProductListView,
)


# Product URLs
urlpatterns = [
    path( "", ProductListCreateView.as_view(), name="product-list-create"),
    path( "<int:pk>/", ProductDetailView.as_view(), name="product-detail"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("<int:product_id>/reviews/",ProductReviewListCreateView.as_view(),name="product-reviews"),
    path("<int:product_id>/reviews/eligibility/", ProductReviewEligibilityView.as_view(), name="product-review-eligibility",),
    path("brands/", BrandListView.as_view(), name="brand-list"),
    path("top-selling/", TopSellingProductListView.as_view(), name="top-selling-products", ),
]