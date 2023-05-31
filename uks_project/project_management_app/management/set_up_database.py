import datetime
from django.core.management.base import BaseCommand

from ..models import Milestone, Repository, User, Issue, Label, PullRequest, Branch

class Command(BaseCommand):
    def insert_data(self):
        User.objects.all().delete()
        Repository.objects.all().delete()
        Issue.objects.all().delete()
        Milestone.objects.all().delete()
      
        user1 = User.objects.create_user(
            given_name="John",
            family_name="Doe",
            username="johndoe",
            email="johndoe@test.com",
            password="123",
        )
        user2 = User.objects.create_user(
            given_name="Jane",
            family_name="Doe",
            username="janedoe",
            email="janedoe@test.com",
            password="123",
        )

        repository = Repository(name="Project Repository", owner=user1, description="This is our repository.", visibility="PUBLIC", default_branch="main")
        repository.save()
        label = Label(name="Label",description="Description label",color="red",repository=repository)
        label.save()
        milestone = Milestone(title="Milestone",due_date=datetime.datetime(2022, 6, 13), description='Milestone description', status='OPEN', repository=repository)
        milestone.save()
        issue = Issue(title="First Issue", status="OPEN", repository=repository, author=user1,milestone=milestone,created_at=datetime.datetime(2022, 6, 13))
        issue.save()
        issue.labels.set([label])
        issue.assignees.set([user2])
        compare_branch = Branch(name="Compare branch", repository = repository)
        compare_branch.save()
        base_branch = Branch(name="Base branch", repository = repository)
        base_branch.save()
        pullRequest = PullRequest(title="Pull request", description="Pull request description", author=user1, repository=repository, base_branch=base_branch, compare_branch=compare_branch,milestone=milestone,status="OPEN",review="APPROVED",created_at=datetime.datetime(2022, 9, 13))
        pullRequest.save()
        pullRequest.labels.set([label])
        pullRequest.assignees.set([user2])
        pullRequest.issues.set([issue])
 
    def handle(self, *args, **options):
        self.insert_data()
