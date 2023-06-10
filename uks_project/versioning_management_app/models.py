from django.db import models

from django.utils import timezone

from users_management_app.models import User

# Create your models here.

# File for: Repository, Branch, Commit

VISIBILITY = [("PUBLIC", "Public"), ("PRIVATE", "Private")]
ACCESS = [("READ", "Read"), ("WRITE", "Write"), ("ADMIN", "Admin")]

class Repository(models.Model):
    name = models.CharField(max_length=100, null=False)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, related_name="owner"
    )
    description = models.CharField(max_length=250, null=True)
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    visibility = models.CharField(max_length=10, choices=VISIBILITY, null=False)
    default_branch = models.CharField(max_length=100, default="main")
    collaborators = models.ManyToManyField(
        User, null=True, through='Collaboration', related_name="collaborators"
    )

    class Meta:
        unique_together = ("owner", "name")


class Branch(models.Model):
    name = models.CharField(max_length=100, null=False)
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE, null=False)

    class Meta:
        unique_together = ("repository", "name")


class Commit(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, related_name="commit_author"
    )
    hash = models.CharField(max_length=500, null=False)
    message = models.CharField(max_length=250, null=True)
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=False)

class Collaboration(models.Model):
    role = models.CharField(max_length=50, choices=ACCESS, default='READ')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "repository")