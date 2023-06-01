import json

from django.test import Client, TestCase
from django.urls import reverse

from ..management.set_up_database import Command
from ..models import Repository, Commit, Branch
from ..models import User


#Integration tests
def get_jwt_token():
    client = Client()
    credentials = {"email": "johndoe@test.com", "password": "123"}
    response = client.post(reverse("sign-in"), credentials)
    y = json.loads(response.content)
    return y.get("access_token", None)


class CommitApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def setUp(self) -> None:
        self.client = Client()
        self.token = f'Bearer {get_jwt_token()}'

    def test_get_all_commits_successful(self):
        response = self.client.get('/versioning/commits/', HTTP_AUTHORIZATION=self.token, content_type='application/json')
        response_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response_obj), 2)

    def test_get_all_commits_wrong_path(self):
        response = self.client.get('/commit/', HTTP_AUTHORIZATION=self.token, content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_get_all_commits_token_failed(self):
        response = self.client.get('/versioning/commits/', HTTP_AUTHORIZATION="", content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_create_commit_successful(self):
        author = User.objects.get(username="johndoe").id
        branch_id = Branch.objects.get(name="Test branch").id
        commit_data = {
            'author': author,
            'message': 'New entity added',
            'hash': 'aaa33',
            'branch': branch_id
        }
        response = self.client.post(reverse("add-new-commit"), data=json.dumps(commit_data), HTTP_AUTHORIZATION=self.token, content_type='application/json')
        response_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Commit.objects.filter(message='New entity added').exists())
        self.assertEqual(response_obj['message'], 'New entity added')

    def test_create_commit_failed(self):
        commit_data = {
            'author': 'sss',
            'message': 'New entity added',
        }
        response = self.client.post(reverse("add-new-commit"), data=json.dumps(commit_data), HTTP_AUTHORIZATION=self.token, content_type='application/json')
        self.assertEqual(response.status_code, 400)
