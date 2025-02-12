from rest_framework import serializers
from .models import Image


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = (
            "id",
            "user_id",
            "image_url",
            "thumbnail_url",
            "caption",
            "created_at",
            "is_visible",
        )
        extra_kwargs = {"user_id": {"read_only": True}}
