from django.test import Client, TestCase
from django.urls import reverse
from ..management.set_up_database import Command
from ..models import  Milestone, User, Repository

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

    def test_successful_get_comments(self):
        milestone = Milestone.objects.all()
        self.assertEqual(len(milestone), 1)  
        self.assertEqual(milestone[0].title, "Milestone")  