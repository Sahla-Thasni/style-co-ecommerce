from django.db import models
from django.utils.text import slugify
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

# Category model
class Category(models.Model):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    def __str__(self):
        return self.name

# Brand model
class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# Style model
class Style(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

# Product model
class Product(models.Model):

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products"
    )

    brand = models.ForeignKey(
        Brand,
        on_delete=models.CASCADE,
        related_name="products",
        null=True,
        blank=True,
    )

    style = models.ForeignKey(
        Style,
        on_delete=models.CASCADE,
        related_name="products",
        null=True,
        blank=True,
    )

    gender = models.CharField(
        max_length=20,
        choices=[
            ("men", "Men"),
            ("women", "Women"),
        ]
    )    

    name = models.CharField(
        max_length=200
    )

    sku = models.CharField(
        max_length=100,
        unique=True
    )

    description = models.TextField()

    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name


# Product image upload path
def product_image_path(instance, filename):
    product_name = instance.product.name.lower().replace(" ", "-")
    color = instance.color.lower().replace(" ", "-")

    return f"products/{product_name}/{color}/{filename}"


# Product image model
class ProductImage(models.Model):

    VIEW_CHOICES = (
        ("front", "Front"),
        ("back", "Back"),
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images"
    )

    color = models.CharField(
        max_length=50
    )

    view = models.CharField(
        max_length=10,
        choices=VIEW_CHOICES
    )

    image = models.ImageField(
        upload_to=product_image_path
    )

    def __str__(self):
        return f"{self.product.name} - {self.color} - {self.view}"
# Product variant model
class ProductVariant(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="variants"
    )

    color = models.CharField(
        max_length=50
    )

    size = models.CharField(
        max_length=20
    )

    stock = models.PositiveIntegerField(
        default=0
    )

    def __str__(self):
        return f"{self.product.name} - {self.color} - {self.size}"

#Product Reviews & Ratings
class ProductReview(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="product_reviews",
    )
    rating = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5),
        ]
    )

    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "user"],
                name="unique_product_review_per_user",
            )
        ]        