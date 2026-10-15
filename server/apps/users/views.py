from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
)

#-------------------------Registration-------------------
# User registration view
class UserRegistrationView(CreateAPIView):

    serializer_class = UserRegistrationSerializer


#--------------------------Login------------------------------
# User login view
class UserLoginView(APIView):

    # Handle user login
    def post(self, request):
        serializer = UserLoginSerializer(
            data=request.data
        )

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Login successful.",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": {
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "phone_number": user.phone_number,
                    },
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


#------------------------Logout---------------------
# User logout view
class UserLogoutView(APIView):

    # Handle user logout
    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"message": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(
            {"message": "User logged out successfully"},
            status=status.HTTP_200_OK
        )