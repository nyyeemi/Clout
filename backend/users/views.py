from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from images.serializers import ImageSerializer
from utils.permissions import IsOwnerOfObject

User = get_user_model()


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()  # User.images.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOfObject]


class UserImageListView(generics.ListAPIView):
    serializer_class = ImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = User.objects.get(id=self.kwargs["user_id"])
        return user.images.all()
