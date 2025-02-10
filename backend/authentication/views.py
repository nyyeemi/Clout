from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

# Rekisteröityminen
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# Kirjautuminen (JWT-tunnukset)
class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]