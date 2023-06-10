from django.db import models

from versioning_management_app.models import Repository
from users_management_app.models import User
from versioning_management_app.models import Branch

# Create your models here.

# File for: Milestone, Issue, Label, Pull Request

STATUS = [
    ("OPEN", "Open"),
    ("CLOSED", "Closed")
]

REVIEW_STATUS = [
    ("APPROVED", "Open"),
    ("CHANGES_REQUESTED", "Changes Requested")
]

class Milestone(models.Model):
    title = models.CharField(max_length=100, null=False)
    due_date = models.DateTimeField(null=True) #optional
    description = models.CharField(max_length=300, null=True) #optional
    status =  models.CharField(max_length=6, choices=STATUS, null=False)
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE, null=False)


class Label(models.Model):
    name = models.CharField(max_length=50, null=False)
    description = models.CharField(max_length=300, null=True) #optional
    color = models.CharField(max_length=30, null=False)
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE, null=False)

class Issue(models.Model):
    title = models.CharField(max_length=100, null=False)
    created_at = models.DateTimeField(null=False, auto_now_add=True)
    status =  models.CharField(max_length=6, choices=STATUS, null=False)
    milestone = models.ForeignKey(Milestone, on_delete=models.CASCADE, null=True) #optional
    labels = models.ManyToManyField(Label, null=True) #optional
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE, null=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=False, related_name="author")
    assignees = models.ManyToManyField(User, null=True, related_name="assignees") #optional

class PullRequest(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=False, related_name="pr_author")
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE, null=False)
    title = models.CharField(max_length=250, null=False)
    description = models.CharField(max_length=500)
    base_branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=False, related_name="base_branch")
    compare_branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=False, related_name="compare_branch")
    issues = models.ManyToManyField(Issue, null=True)
    milestone = models.ForeignKey(Milestone, on_delete=models.CASCADE, null=True)
    labels = models.ManyToManyField(Label, null=True)
    assignees = models.ManyToManyField(User, null=True, related_name="pr_assignees")
    status = models.CharField(max_length=6, choices=STATUS, null=False)
    review = models.CharField(max_length=20, choices=REVIEW_STATUS, null=False)
    created_at = models.DateTimeField(null=False, auto_now_add=True)
