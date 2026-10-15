from rest_framework import serializers
from django.db.models import Avg, Count

from .models import (
    Category,
    Brand,
    Style,
    Product,
    ProductImage,
    ProductVariant,
    ProductReview,
)


# Category serializer
class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = (
            "id",
            "name",
        )


# Brand serializer
class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = (
            "id",
            "name",
        )


# Style serializer
class StyleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Style
        fields = (
            "id",
            "name",
        )


# Product image serializer
class ProductImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductImage
        fields = (
            "id",
            "color",
            "view",
            "image",
        )

# Product variant serializer
class ProductVariantSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductVariant
        fields = (
            "id",
            "color",
            "size",
            "stock",
        )




# Product serializer
class ProductSerializer(serializers.ModelSerializer):

    images = ProductImageSerializer(
        many=True,
        read_only=True
    )

    variants = ProductVariantSerializer(
        many=True,
        read_only=True
    )

    category = CategorySerializer(
        read_only=True
    )

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )

    brand = BrandSerializer(
        read_only=True
    )

    brand_id = serializers.PrimaryKeyRelatedField(
        queryset=Brand.objects.all(),
        source="brand",
        write_only=True,
        allow_null=True,
        required=False
    )

    style = StyleSerializer(
        read_only=True
    )

    style_id = serializers.PrimaryKeyRelatedField(
        queryset=Style.objects.all(),
        source="style",
        write_only=True,
        allow_null=True,
        required=False
    )


    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    def get_average_rating(self, obj):
        return round(
            obj.reviews.aggregate(
                average=Avg("rating")
            )["average"] or 0,
            1
        )

    def get_review_count(self, obj):
        return obj.reviews.count()


    class Meta:
        model = Product
        fields = (
            "id",
            "category",
            "category_id",
            "brand",
            "brand_id",
            "style",
            "style_id",
            "gender",
            "name",
            "sku",
            "description",
            "unit_price",
            "discount_percentage",
            "discount_price",
            "is_active",
            "images",
            "variants",
            "average_rating",
            "review_count",
            "created_at",
            "updated_at",
        )


#Review Serializer
class ProductReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(
        source="user.first_name",
        read_only=True,
    )

    class Meta:
        model = ProductReview
        fields = (
            "id",
            "user_name",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "user_name",
            "created_at",
            "updated_at",
        )