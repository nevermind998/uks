from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Create your models here.

# File for: User, Account


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


class User(AbstractBaseUser):
    username = models.CharField(max_length=100, null=False, unique=True)
    email = models.CharField(max_length=100, null=False, unique=True)
    given_name = models.CharField(max_length=100, null=False)
    family_name = models.CharField(max_length=100, null=False)
    bio = models.CharField(max_length=100, null=True)
    url = models.CharField(max_length=100, null=True)

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["email", "given_name", "family_name"]

    objects = UserManager()
