from django.test import Client, TestCase
from django.urls import reverse

from ..management.set_up_database import Command
import json
from ..models import User, Action, Repository

#Integration Tests

JSON = 'application/json'

def get_jwt_token():
    client = Client()
    credentials = {"email": "johndoe@test.com", "password": "123"}
    response = client.post(reverse("sign-in"), credentials)
    y = json.loads(response.content)
    return  y.get("access_token", None)

class ActionsApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def setUp(self) -> None:
        self.client = Client()
        self.token = f'Bearer {get_jwt_token()}'

    def test_get_user_stars(self):
        user = User.objects.get(username="janedoe").id
        response = self.client.get('/user-actions/user-profile/'+str(user)+'/stars', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(res_obj),1)

    def test_get_all_actions_wrong_path(self):
        response = self.client.get('/user-actions/actions', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)
    
    def test_get_user_stars_unauth(self):
        user = User.objects.get(username="janedoe").id
        response = self.client.get('/user-actions/user-profile/'+str(user)+'/stars', HTTP_AUTHORIZATION="", content_type=JSON)
        self.assertEqual(response.status_code, 401)

    def test_get_action_for_user(self):
        user = User.objects.get(username="janedoe").id
        repository = Repository.objects.get(name="Project Repository").id
        response = self.client.get('/user-actions/repository/'+str(repository)+'/user/'+str(user)+'/star', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_obj['type'], 'STAR')
    
    def test_get_action_for_user_fail(self):
        user = User.objects.get(username="johndoe").id
        repository = Repository.objects.get(name="Project Repository").id
        response = self.client.get('/user-actions/repository/'+str(repository)+'/user/'+str(user)+'/star', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 200)
    
    def test_get_repo_stargazers(self):
        repository = Repository.objects.get(name="Project Repository").id
        response = self.client.get('/user-actions/repository/'+str(repository)+'/stargazers', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(len(res_obj),1)
        self.assertEqual(response.status_code, 200)
    
    def test_get_repo_stargazers_fail(self):
        response = self.client.get('/user-actions/repository/89/stargazers', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.data, [])
    
    def test_get_repo_watchers(self):
        repository = Repository.objects.get(name="Project Repository").id
        response = self.client.get('/user-actions/repository/'+str(repository)+'/watchers', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(len(res_obj),1)
        self.assertEqual(response.status_code, 200)
    
    def test_get_repo_watchers_fail(self):
        response = self.client.get('/user-actions/repository/89/watchers', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.data, [])
    
    def test_get_repo_forks(self):
        repository = Repository.objects.get(name="Project Repository").id
        response = self.client.get('/user-actions/repository/'+str(repository)+'/forked-repos', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(len(res_obj),1)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_obj[0]['name'], 'Forked Repository')

    
    def test_get_repo_forks_fail(self):
        response = self.client.get('/user-actions/repository/89/forked-repos', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.data, [])

    def test_post_create_action(self):
        author = User.objects.get(username="johndoe").id
        repository = Repository.objects.get(name="Project Repository").id
        comment = {
        "type": "WATCH",
        "author": author,
        "repository": repository
        }

        response = self.client.post(
            '/user-actions/new-action',
            data=json.dumps(comment),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )
        res_obj = json.loads(response.content)
       
        self.assertEqual(response.status_code, 201)
        self.assertEqual(res_obj['type'], 'WATCH')
    
    def test_post_create_comment_fail(self):
        author = User.objects.get(username="johndoe").id
        repository = Repository.objects.get(name="Project Repository").id
        comment = {
        "type": "MOON",
        "author": author,
        "repository": repository
        }

        response = self.client.post(
            '/user-actions/new-action',
            data=json.dumps(comment),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )
        self.assertEqual(response.status_code, 400)
    
    def test_delete_action(self):
        action = Action.objects.get(type="STAR").id
        response = self.client.delete(
            '/user-actions/actions/'+str(action),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 204)

    def test_delete_action_fail(self):
        response = self.client.delete(
            '/user-actions/actions/99',
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 404)