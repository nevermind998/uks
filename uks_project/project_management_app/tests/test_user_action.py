from django.test import Client, TestCase
from django.urls import reverse
from ..models import Milestone, User, Issue, Repository
from ..management.set_up_database import Command
import json

#Integration Tests

JSON = 'application/json'

def get_jwt_token():
    client = Client()
    credentials = {"email": "johndoe@test.com", "password": "123"}
    response = client.post(reverse("sign-in"), credentials)
    y = json.loads(response.content)
    return  y.get("access_token", None)

class MilestoneApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def setUp(self) -> None:
        self.client = Client()
        self.token = f'Bearer {get_jwt_token()}'

    def test_get_all_milestone(self):
        response = self.client.get('/project/milestones/', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(len(res_obj),1)
        self.assertEqual(response.status_code, 200)

    def test_get_all_milestone_wrong_path(self):
        response = self.client.get('/project/milestones/all', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)

    def test_get_all_milestone_unauth(self):
        response = self.client.get('/project/milestones/', HTTP_AUTHORIZATION="", content_type=JSON)
        self.assertEqual(response.status_code, 401)

    def test_get_milestone_by_repository(self):
        repository = Repository.objects.get(name='Project Repository').id
        response = self.client.get('/project/milestone/'+str(repository)+'/repository', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(res_obj),1)

    def test_get_milestone_by_repository_fail(self):
        response = self.client.get('/project/milestone/55/repository', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)

    def test_post_create_milestone(self):
        repository = Repository.objects.get(name='Project Repository').id
        milestone = {
            "title":"New Milestone",
            "due_date":"2023-06-25T08:30",
            "description":"Milestone description",
            "status":"OPEN",
            "repository": repository
        }

        response = self.client.post(
            '/project/new-milestone',
            data=json.dumps(milestone),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )

        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(res_obj['title'], 'New Milestone')

    def test_post_create_milestone_fail(self):
        milestone = {
        "title": "Fail Milestone",
        }

        response = self.client.post(
            '/project/new-milestone',
            data=json.dumps(milestone),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 400)

    def test_update_milestone(self):
        milestone = Milestone.objects.get(title="Milestone")
        repository = Repository.objects.get(name='Project Repository').id
        new_milestone = {
            "title" : "New Title.",
            "repository": repository,
            "status":"OPEN"
            }
        response = self.client.put(
            '/project/update-milestone/'+str(milestone.id),
            data=json.dumps(new_milestone),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        res_obj = json.loads(response.content)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_obj['title'], 'New Title.')

    def test_upate_milestone_fail(self):
        milestone = Milestone.objects.get(title="Milestone")
        new_milestone = {
            "title" : "New Title."
            }
        response = self.client.put(
            '/project/update-milestone/'+str(milestone.id),
            data=json.dumps(new_milestone),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 400)

    def test_delete_milestone(self):
        milestone = Milestone.objects.get(title="Milestone").id
        response = self.client.delete(
            '/project/delete-milestone/'+str(milestone),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 204)

    def test_delete_milestone_fail(self):
        response = self.client.delete(
            '/project/delete-milestone/98',
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 404)