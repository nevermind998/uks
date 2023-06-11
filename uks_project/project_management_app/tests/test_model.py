import datetime
from django.test import TestCase
from ..management.set_up_database import Command
from ..models import  Milestone, User, Repository, Label, Issue, Branch, PullRequest

#Unit Tests

class MilestonesTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def test_create_new_milestone(self):
        repository = Repository.objects.get(name='Project Repository')
        new_milestone = Milestone(title="Milestone title",due_date='2022-06-13', description='Milestone description', status='OPEN', repository=repository)
        new_milestone.save()
        self.assertEqual(new_milestone.title,"Milestone title")
        self.assertEqual(new_milestone.description,"Milestone description")
        self.assertEqual(new_milestone.repository.name,"Project Repository")

    def test_successful_get_milestone(self):
        milestone = Milestone.objects.all()
        self.assertEqual(len(milestone), 1)  
        self.assertEqual(milestone[0].title, "Milestone")  


class LabelsTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def test_create_new_label(self):
        repository = Repository.objects.get(name='Project Repository')
        new_label = Label(name="Label title",description="Description label",color="red",repository=repository,)
        new_label.save()
        self.assertEqual(new_label.name,"Label title")
        self.assertEqual(new_label.description,"Description label")
        self.assertEqual(new_label.repository.name,"Project Repository")

    def test_successful_get_labels(self):
        label = Label.objects.all()
        self.assertEqual(len(label), 1)  
        self.assertEqual(label[0].name, "Label")  

class IssuesTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def test_create_new_issue(self):
        repository = Repository.objects.get(name='Project Repository')
        assignee = User.objects.get(given_name='Jane')
        milestone = Milestone.objects.get(title='Milestone')
        author = User.objects.get(given_name='John')
        label = Label.objects.get(name='Label')
        assignee = User.objects.get(given_name='Jane')
        new_issue = Issue(title="First Issue", status="OPEN", repository=repository, author=author,milestone=milestone,created_at=datetime.datetime(2022, 6, 13))
        new_issue.save()
        new_issue.labels.set([label])
        new_issue.assignees.set([assignee])
        new_issue.save()
        self.assertEqual(new_issue.title,"First Issue")
        self.assertEqual(new_issue.status,"OPEN")
        self.assertEqual(new_issue.repository.name,"Project Repository")

    def test_successful_get_issues(self):
        issue = Issue.objects.all()
        self.assertEqual(len(issue), 1)  
        self.assertEqual(issue[0].title, "First Issue") 

class PullRequestsTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def test_create_new_pull_request(self):
        repository = Repository.objects.get(name='Project Repository')
        assignee = User.objects.get(given_name='Jane')
        milestone = Milestone.objects.get(title='Milestone')
        author = User.objects.get(given_name='John')
        label = Label.objects.get(name='Label')
        base_branch = Branch.objects.get(name='Base branch')
        compare_branch = Branch.objects.get(name='Compare branch')
        issue = Issue.objects.get(title='First Issue')
        new_pull_request = PullRequest(title="First pull request", description="Pull request description", author=author, repository=repository, base_branch=base_branch, compare_branch=compare_branch,milestone=milestone,status="OPEN",review="APPROVED",created_at=datetime.datetime(2022, 9, 13))
        new_pull_request.save()
        new_pull_request.labels.set([label])
        new_pull_request.assignees.set([assignee])
        new_pull_request.issues.set([issue])
        self.assertEqual(new_pull_request.title,"First pull request")
        self.assertEqual(new_pull_request.status,"OPEN")
        self.assertEqual(new_pull_request.repository.name,"Project Repository")

    def test_successful_get_pull_request(self):
        pull_request = PullRequest.objects.all()
        self.assertEqual(len(pull_request), 1)  
        self.assertEqual(pull_request[0].title, "Pull request") 