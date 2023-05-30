from django.core.management.base import BaseCommand

from ..models import User, Repository, Issue, PullRequest, Comment


class Command(BaseCommand):
    def insert_data(self):
        User.objects.all().delete()
        Repository.objects.all().delete()
        Issue.objects.all().delete()
        Comment.objects.all().delete()

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
        repo = Repository(name="Project Repository", owner=user1, description="This is our repository.", visibility="PUBLIC", default_branch="main")
        repo.save()
        issue = Issue(title="First Issue", status="OPEN", repository=repo, author=user1)
        issue.save()
        comment = Comment(author=user1, content="Jane please finish this issue by this Friday. Thanks.",  issue=issue)
        comment.save()


    def handle(self, *args, **options):
        self.insert_data()
