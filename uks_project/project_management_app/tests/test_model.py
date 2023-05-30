from django.test import TestCase
from ..management.set_up_database import Command
from ..models import  Milestone, User, Repository, Label

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

    def test_create_new_label(self):
        repository = Repository.objects.get(name='Project Repository')
        new_label = Label(name="Label title",description="Description label",color="red",repository=repository,)
        new_label.save()
        self.assertEqual(new_label.name,"Label title")
        self.assertEqual(new_label.description,"Description label")
        self.assertEqual(new_label.repository.name,"Project Repository")

    def test_successful_get_comments(self):
        label = Label.objects.all()
        self.assertEqual(len(label), 1)  
        self.assertEqual(label[0].name, "Label")  