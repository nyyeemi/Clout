from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.validators import UnicodeUsernameValidator


class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    email = models.EmailField(
        error_messages={"unique": "A user with that email already exists."},
        max_length=128,
        verbose_name="email address",
        unique=True,
    )
    username = models.CharField(
        max_length=30,
        unique=True,
        validators=[UnicodeUsernameValidator()],
        error_messages={"unique": "A user with that username already exists."},
    )

    def __str__(self):
        return self.username
