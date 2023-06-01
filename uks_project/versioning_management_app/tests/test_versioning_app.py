from django.test import Client, TestCase
from django.urls import reverse
from ..management.set_up_database import Command
from ..models import User, Repository

import json

#Integration tests
def get_jwt_token():
    client = Client()
    credentials = {"email": "johndoe@test.com", "password": "123"}
    response = client.post(reverse("sign-in"), credentials)
    y = json.loads(response.content)
    return y.get("access_token", None)


class RepositoryApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def setUp(self) -> None:
        self.client = Client()
        self.token = f'Bearer {get_jwt_token()}'

    def test_get_all_repositories_successful(self):
        response = self.client.get('/versioning/repositories/', HTTP_AUTHORIZATION=self.token, content_type='application/json')
        response_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response_obj), 1)

    def test_get_all_repositories_wrong_path(self):
        response = self.client.get('/repositories/', HTTP_AUTHORIZATION=self.token, content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_get_all_repositories_token_failed(self):
        response = self.client.get('/versioning/repositories/', HTTP_AUTHORIZATION="", content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_get_repository_collaborators_failed(self):
        response = self.client.get('/versioning/repository/' + '1' + '/collaborators', HTTP_AUTHORIZATION=self.token, content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_create_repository_successful(self):
        owner = User.objects.get(username="johndoe").id
        repository_data = {
            'name': 'UKS',
            'owner': owner,
            'description': 'This is OUR repository',
            'visibility': 'PUBLIC',
            'default_branch': 'main'
        }
        response = self.client.post(reverse("add_repository"), data=json.dumps(repository_data), HTTP_AUTHORIZATION=self.token, content_type='application/json')
        response_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Repository.objects.filter(name='UKS').exists())
        self.assertEqual(response_obj['name'], 'UKS')
        self.assertEqual(response_obj['owner'], owner)

    def test_create_repository_user_not_found(self):
        repository_data = {
            'name': 'New Repository',
            'owner': 'nekitamo@gmail.com',
            'description': 'This is OUR repository',
            'visibility': 'PUBLIC',
            'default_branch': 'main'
        }
        response = self.client.post('versioning/new-repository', data=json.dumps(repository_data), HTTP_AUTHORIZATION=self.token, content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_edit_repository_failed(self):
        repository = Repository.objects.get(name="UKS").id
        new_repository = {
            "name": "New Repository",
        }
        response = self.client.put('versioning/repository/' + str(repository), data=json.dumps(new_repository), HTTP_AUTHORIZATION=self.token, content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_delete_repository_successful(self):
        repository = Repository.objects.get(name="UKS").id
        response = self.client.delete(
            reverse('delete_or_edit_repository', kwargs={'id': str(repository)}),
            HTTP_AUTHORIZATION=self.token,
            content_type='application/json')
        self.assertEqual(response.status_code, 204)

    def test_delete_repository_failed(self):
        response = self.client.delete('versioning/repository/44', HTTP_AUTHORIZATION=self.token, content_type='application/json')
        self.assertEqual(response.status_code, 404)
