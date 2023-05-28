from django.db import models
from django.utils import timezone

from users_management_app.models import User
from project_management_app.models import Issue, PullRequest
from versioning_management_app.models import Repository

# Create your models here.

# File for: Comment, Reaction, Action

REACTION = [
    ("LIKE", "Like"),
    ("DISLIKE", "Dislike"),
    ("Love", "Love"),
    ("HAPPY", "Happy"),
    ("SAD", "Sad")
]

ACTION = [
    ("FORK", "Fork"),
    ("STAR", "Star"),
    ("WATCH", "Watch")
]

class Action(models.Model):
     author = models.ForeignKey(User, on_delete=models.CASCADE, null=False, related_name="action_author")
     type = models.CharField(max_length=6, choices=ACTION, null=False)
     repository = models.ForeignKey(Repository, on_delete=models.CASCADE, null=True, related_name="repo_action")

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=False, related_name="comment_author")
    created_at = models.DateTimeField(null=False, auto_now_add=True)
    updated_at = models.DateTimeField(null=False, auto_now=True)
    content = models.CharField(max_length=300, null=True) #optional
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, null=True)
    pull_request = models.ForeignKey(PullRequest, on_delete=models.CASCADE, null=True)

class Reaction(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=False, related_name="reaction_author")
    comment =  models.ForeignKey(Comment, on_delete=models.CASCADE, null=True)
    type = models.CharField(max_length=6, choices=REACTION, null=False)


