from django.urls import path
from .views import UserListView, UserDetailView, UserImageListView

urlpatterns = [
    path("", UserListView.as_view(), name="user-list-create"),
    path("<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("<int:user_id>/images/", UserImageListView.as_view(), name="user-images"),
]
