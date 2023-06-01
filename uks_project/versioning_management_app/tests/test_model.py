from django.test import TestCase
from ..management.set_up_database import Command
from ..models import User, Repository

class RepositoryTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def test_repositories_successful(self):
        repos = Repository.objects.all()
        self.assertEqual(len(repos), 1)
        self.assertEqual(repos[0].name, "UKS")

    def test_add_new_repository(self):
        owner = User.objects.filter(username="janedoe").first()
        new_repository = Repository.objects.create(name="UKS", owner=owner, description="This is our repository", visibility="PUBLIC", default_branch="main")
        new_repository.save()

        self.assertEqual(new_repository.name, "UKS")
        self.assertEqual(new_repository.owner.given_name, "Jane")

    def test_get_repository_collaborators_successful(self):
        owner = User.objects.filter(username="janedoe").first()
        repository = Repository.objects.create(name="UKS", owner=owner, description="This is our repository", visibility="PUBLIC", default_branch="main")
        collaborator1 = User.objects.create(username="janedoee")
        repository.collaborators.add(collaborator1)

        collaborator_usernames = [collaborator.username for collaborator in repository.collaborators.all()]
        self.assertIn("janedoee", collaborator_usernames)


