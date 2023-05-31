from django.core.management.base import BaseCommand

from ..models import User, Repository, Issue, PullRequest, Comment, Reaction, Action


class Command(BaseCommand):
    def insert_data(self):
        User.objects.all().delete()
        Repository.objects.all().delete()
        Issue.objects.all().delete()
        Comment.objects.all().delete()
        Reaction.objects.all().delete()
        Action.objects.all().delete()

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
        repo2 = Repository(name="Forked Repository", owner=user1, description="This is our repository.", visibility="PUBLIC", default_branch="main")
        repo2.save()
        issue = Issue(title="First Issue", status="OPEN", repository=repo, author=user1)
        issue.save()
        comment = Comment(author=user1, content="Jane please finish this issue by this Friday. Thanks.",  issue=issue)
        comment.save()
        reaction = Reaction(author=user2, comment=comment, type="LIKE")
        reaction.save()
        action1 = Action(author=user2, type="STAR", repository=repo)
        action1.save()
        action2 = Action(author=user1, type="WATCH", repository=repo)
        action2.save()
        action3 = Action(author=user2, type="FORK", repository=repo, forked_repo=repo2)
        action3.save()


    def handle(self, *args, **options):
        self.insert_data()
