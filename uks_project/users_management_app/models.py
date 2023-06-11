from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(
        self, username, given_name, family_name, email, password, **extra_fields
    ):
        user = self.model(
            username=username,
            given_name=given_name,
            family_name=family_name,
            email=email,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=100, null=False, unique=True)
    email = models.CharField(max_length=100, null=False, unique=True)
    given_name = models.CharField(max_length=100, null=False)
    family_name = models.CharField(max_length=100, null=False)
    bio = models.CharField(max_length=100, null=True)
    url = models.CharField(max_length=100, null=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["username", "given_name", "family_name"]

    objects = UserManager()
