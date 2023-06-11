from django.test import TestCase
from ..management.set_up_database import Command
from ..models import User, Repository, Branch, Commit


class RepositoryTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def test_get_repositories_successful(self):
        repos = Repository.objects.all()
        self.assertEqual(len(repos), 2)
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

class BranchTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def test_get_branches_successful(self):
        branches = Branch.objects.all()
        self.assertEqual(len(branches), 2)
        self.assertEqual(branches[0].name, "Test branch")

    def test_add_new_branch(self):
        repository = Repository.objects.filter(name='UKS').first()
        new_branch = Branch.objects.create(name="Test branch 1", repository=repository)
        new_branch.save()

        self.assertEqual(new_branch.name, "Test branch 1")
        self.assertEqual(new_branch.repository.name, "UKS")

class CommitTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def test_get_commits_successful(self):
        commits = Commit.objects.all()
        self.assertEqual(len(commits), 2)
        self.assertEqual(commits[0].message, "New entity added")
        self.assertEqual(commits[1].message, "Bug fixed")

    def test_add_new_commit(self):
        author = User.objects.filter(username="johndoe").first()
        branch = Branch.objects.filter(name="Test branch").first()
        new_commit = Commit.objects.create(author=author, message='New entity added', hash="ddd33", branch=branch)
        new_commit.save()

        self.assertEqual(new_commit.message, "New entity added")
