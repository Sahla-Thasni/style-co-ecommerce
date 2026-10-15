from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User

#--------------------Registration------------------
# User registration serializer
class UserRegistrationSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = (
            "email",
            "password",
            "first_name",
            "last_name",
            "phone_number",
        )

    # Create new user
    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        return user

#-----------------Login---------------------------

# User login serializer
class UserLoginSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True
    )

    # Validate user login
    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        user = authenticate(
            email=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid email or password"
            )

        data["user"] = user

        return data        