from django.db import models

# Create your models here.

# File for: User, Account

class User(models.Model):
    username = models.CharField(max_length=100, null=False, unique=True)
    email = models.CharField(max_length=100, null=False, unique=True)
    given_name = models.CharField(max_length=100, null=False)
    family_name = models.CharField(max_length=100, null=False)
    bio = models.CharField(max_length=100, null=True) #optional
    url = models.CharField(max_length=100, null=True) #optional

