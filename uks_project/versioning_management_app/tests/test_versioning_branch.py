import json

from django.test import Client, TestCase
from django.urls import reverse

from ..management.set_up_database import Command
from ..models import Repository, Branch


#Integration tests
def get_jwt_token():
    client = Client()
    credentials = {"email": "johndoe@test.com", "password": "123"}
    response = client.post(reverse("sign-in"), credentials)
    y = json.loads(response.content)
    return y.get("access_token", None)


class BranchApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def setUp(self) -> None:
        self.client = Client()
        self.token = f'Bearer {get_jwt_token()}'

    def test_get_all_branches_successful(self):
        response = self.client.get('/versioning/branches/', HTTP_AUTHORIZATION=self.token, content_type='application/json')
        response_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response_obj), 2)

    def test_get_all_branches_wrong_path(self):
        response = self.client.get('/branch/', HTTP_AUTHORIZATION=self.token, content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_get_all_branches_token_failed(self):
        response = self.client.get('/versioning/branches/', HTTP_AUTHORIZATION="", content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_create_branch_successful(self):
        repository_id = Repository.objects.get(name="UKS").id
        branch_data = {
            'name': 'test_branch_1',
            'repository': repository_id
        }
        response = self.client.post(reverse("add_branch"), data=json.dumps(branch_data), HTTP_AUTHORIZATION=self.token, content_type='application/json')
        response_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Branch.objects.filter(name='test_branch_1').exists())
        self.assertEqual(response_obj['name'], 'test_branch_1')
        self.assertEqual(response_obj['repository'], repository_id)

    def test_create_branch_failed(self):
        branch_data = {
            'name': 'Test branch',
            'repository': 'novi'
        }
        response = self.client.post(reverse("add_branch"), data=json.dumps(branch_data), HTTP_AUTHORIZATION=self.token, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_delete_branch_success(self):
        branch = Branch.objects.filter(name="Test branch").first().id
        response = self.client.delete('/versioning/branch/' + str(branch), HTTP_AUTHORIZATION=self.token, content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_delete_branch_failed(self):
        response = self.client.delete('/versioning/branch/99', HTTP_AUTHORIZATION=self.token, content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_rename_branch_success(self):
        branch_id = Branch.objects.filter(name="New").first().id
        repository_id = Repository.objects.get(name='UKS').id

        branch_data = {
            "name": "Update branch",
            "repository": repository_id
        }
        response = self.client.put(
            '/versioning/branch/' + str(branch_id) + '/edit',
            data=json.dumps(branch_data),
            HTTP_AUTHORIZATION=self.token,
            content_type='application/json'
        )
        res_obj = json.loads(response.content)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_obj['name'], 'Update branch')

    def test_rename_branch_failed(self):
        branch_id = Branch.objects.filter(name="New").first().id

        branch_data = {
            "name": "Update branch",
        }
        response = self.client.put(
            '/versioning/branch/' + str(branch_id) + '/edit',
            data=json.dumps(branch_data),
            HTTP_AUTHORIZATION=self.token,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
