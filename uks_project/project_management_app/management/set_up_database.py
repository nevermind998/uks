from django.core.management.base import BaseCommand

from ..models import Milestone, Repository, User, Issue, Label

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
        label = Label(name="Label",description="Description label",color="red",repository=repository,)
        label.save()
        issue = Issue(title="First Issue", status="OPEN", repository=repository, author=user1)
        issue.save()
        milestone = Milestone(title="Milestone",due_date='2022-02-12', description='Milestone description', status='OPEN', repository=repository)
        milestone.save()

    def handle(self, *args, **options):
        self.insert_data()