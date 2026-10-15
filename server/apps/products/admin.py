from django.contrib import admin

from .models import (
    Category,
    Brand,
    Style,
    Product,
    ProductImage,
    ProductVariant,
    ProductReview
)


# Category admin
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "name",
    )


# Brand admin
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "name",
    )


# Style admin
@admin.register(Style)
class StyleAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "name",
    )


# Product admin
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "category",
        "brand",
        "style",
        "gender",
        "sku",
        "unit_price",
        "discount_percentage",
        "discount_price",
        "is_active",
    )

    search_fields = (
        "name",
        "sku",
        "description",
    )

    list_filter = (
        "category",
        "brand",
        "style",
        "gender",
        "is_active",
    )

    ordering = (
        "-created_at",
    )


# Product image admin
@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "product",
        "color",
        "view",
        "image",
    )

    search_fields = (
        "product__name",
        "color",
    )

    list_filter = (
        "color",
        "view",
    )


# Product variant admin
@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "product",
        "color",
        "size",
        "stock",
    )

    search_fields = (
        "product__name",
        "color",
        "size",
    )

    list_filter = (
        "color",
        "size",
    )

#Product review admin
@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "user",
        "rating",
        "created_at",
    )