import datetime
from django.test import TestCase
from ..management.set_up_database import Command
from ..models import  Milestone, User, Repository, Label, Issue

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