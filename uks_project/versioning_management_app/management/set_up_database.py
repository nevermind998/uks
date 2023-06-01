from django.core.management import BaseCommand

from ..models import Repository, Branch, Commit, User


class Command(BaseCommand):
    def insert_values(self):
        Repository.objects.all().delete()
        Branch.objects.all().delete()
        Commit.objects.all().delete()
        User.objects.all().delete()

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

        repository = Repository(name="UKS", owner=user1, description="This is our repository.", visibility="PUBLIC", default_branch="main")
        repository.save()
        repository2 = Repository(name="UKS2", owner=user1, description="Second repository.", visibility="PUBLIC", default_branch="main")
        repository2.save()
        branch = Branch(name="Test branch", repository=repository)
        branch.save()
        branch2 = Branch(name="New", repository=repository)
        branch2.save()
        commit = Commit(author=user1, hash="56wh123", message="New entity added", created_at="2023-05-05", branch=branch)
        commit.save()
        commit2 = Commit(author=user1, hash="56wh123", message="Bug fixed", created_at="2023-05-05", branch=branch2)
        commit2.save()

    def handle(self, *args, **options):
        self.insert_values()
