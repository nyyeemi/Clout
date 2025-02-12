from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Image(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="images")
    image_url = models.URLField()
    thumbnail_url = models.URLField(blank=True, null=True)
    caption = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_visible = models.BooleanField(default=True)

    def __str__(self):
        return f"Photo from {self.user.username}, created at {self.created_at}"


# TODO: use django signals (pre_delete) to delete photo from s3
# before photos are removed from db (if user destroyed)
