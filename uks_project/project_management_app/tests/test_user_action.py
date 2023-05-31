from django.test import Client, TestCase
from django.urls import reverse
from ..models import Milestone, User, Issue, Repository, Label
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
        request = {
            "title":"New Milestone",
            "due_date":"2023-06-25T08:30",
            "description":"Milestone description",
            "status":"OPEN",
            "repository": repository
        }

        response = self.client.post(
            '/project/new-milestone',
            data=json.dumps(request),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )

        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(res_obj['title'], 'New Milestone')

    def test_post_create_milestone_fail(self):
        request = {
        "title": "Fail Milestone",
        }

        response = self.client.post(
            '/project/new-milestone',
            data=json.dumps(request),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 400)

    def test_update_milestone(self):
        milestone = Milestone.objects.get(title="Milestone")
        repository = Repository.objects.get(name='Project Repository').id
        request = {
            "title" : "New Title.",
            "repository": repository,
            "status":"OPEN"
            }
        response = self.client.put(
            '/project/update-milestone/'+str(milestone.id),
            data=json.dumps(request),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        res_obj = json.loads(response.content)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_obj['title'], 'New Title.')

    def test_upate_milestone_fail(self):
        milestone = Milestone.objects.get(title="Milestone")
        request = {
            "title" : "New Title."
            }
        response = self.client.put(
            '/project/update-milestone/'+str(milestone.id),
            data=json.dumps(request),
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

class LabelApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def setUp(self) -> None:
        self.client = Client()
        self.token = f'Bearer {get_jwt_token()}'

    def test_get_all_label(self):
        response = self.client.get('/project/labels/', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(len(res_obj),1)
        self.assertEqual(response.status_code, 200)

    def test_get_all_label_wrong_path(self):
        response = self.client.get('/project/labels/all', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)

    def test_get_all_label_unauth(self):
        response = self.client.get('/project/labels/', HTTP_AUTHORIZATION="", content_type=JSON)
        self.assertEqual(response.status_code, 401)

    def test_get_label_by_color(self):
        response = self.client.get('/project/label/red/color', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(res_obj),1)

    def test_get_label_by_repository_fail(self):
        response = self.client.get('/project/label/black/color', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)

    def test_post_create_label(self):
        repository = Repository.objects.get(name='Project Repository').id
        request = {
            "name":"Label name",
            "description":"Label description",
            "color":"white",
            "repository": repository
        }

        response = self.client.post(
            '/project/new-label',
            data=json.dumps(request),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )

        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(res_obj['name'], 'Label name')

    def test_post_create_label_fail(self):
        label = {
            "name": "Fail label",
            }

        response = self.client.post(
            '/project/new-label',
            data=json.dumps(label),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 400)

    def test_update_label(self):
        label = Label.objects.get(name="Label")
        repository = Repository.objects.get(name='Project Repository').id
        request = {
            "name":"Update label",
            "color":"black",
            "repository": repository,
            }
        response = self.client.put(
            '/project/update-label/'+str(label.id),
            data=json.dumps(request),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        res_obj = json.loads(response.content)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_obj['color'], 'black')

    def test_upate_label_fail(self):
        label = Label.objects.get(name="Label")
        request = {
            "color" : "grey"
            }
        response = self.client.put(
            '/project/update-label/'+str(label.id),
            data=json.dumps(request),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 400)

    def test_delete_label(self):
        label = Label.objects.get(name="Label")
        response = self.client.delete(
            '/project/delete-label/'+str(label.id),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 204)

    def test_delete_label_fail(self):
        response = self.client.delete(
            '/project/delete-label/98',
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 404)

class IssueApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def setUp(self) -> None:
        self.client = Client()
        self.token = f'Bearer {get_jwt_token()}'

    def test_get_all_issue(self):
        response = self.client.get('/project/issues/', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(len(res_obj),1)
        self.assertEqual(response.status_code, 200)

    def test_get_all_issue_wrong_path(self):
        response = self.client.get('/project/issue/all', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)

    def test_get_all_issue_unauth(self):
        response = self.client.get('/project/issues/', HTTP_AUTHORIZATION="", content_type=JSON)
        self.assertEqual(response.status_code, 401)

    def test_get_issue_by_status(self):
        response = self.client.get('/project/issues/OPEN/status', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(res_obj),1)

    def test_get_issue_by_status_fail(self):
        response = self.client.get('/project/issues/APPROVED/status', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)

    def test_get_issue_by_author(self):
        author = User.objects.get(given_name='John')
        response = self.client.get('/project/issues/'+str(author.id)+'/author', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(res_obj),1)

    def test_get_issue_by_author_fail(self):
        response = self.client.get('/project/issues/55/author', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)

    def test_get_issue_by_label(self):
        label = Label.objects.get(name='Label')
        response = self.client.get('/project/issues/'+str(label.id)+'/label', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(res_obj),1)

    def test_get_issue_by_label_fail(self):
        response = self.client.get('/project/issues/55/label', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)
    
    def test_get_issue_by_milestone(self):
        milestone = Milestone.objects.get(title='Milestone')
        response = self.client.get('/project/issues/'+str(milestone.id)+'/milestone', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(res_obj),1)

    def test_get_issue_by_milestone_fail(self):
        response = self.client.get('/project/issues/55/milestone', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)

    def test_get_issue_by_assignee(self):
        assignee = User.objects.get(given_name='Jane')
        response = self.client.get('/project/issues/'+str(assignee.id)+'/assignee', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(res_obj),1)

    def test_get_issue_by_assignee_fail(self):
        response = self.client.get('/project/issues/55/assignee', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)

    def test_post_create_issue(self):
        repository = Repository.objects.get(name='Project Repository').id
        assignee = User.objects.get(given_name='Jane').id
        milestone = Milestone.objects.get(title='Milestone').id
        author = User.objects.get(given_name='John').id
        label = Label.objects.get(name='Label').id
        request = {
            "repository": repository,
            "title": "New issue",
            "created_at": "2022-03-12",
            "status": "OPEN",
            "milestone": milestone,
            "labels":[label],
            "author": author,
            "assignees": [assignee]
        }

        response = self.client.post(
            '/project/new-issue',
            data=json.dumps(request),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )

        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(res_obj['title'], 'New issue')

    def test_post_create_issue_fail(self):
        request = {
            "name": "Fail issue",
            }

        response = self.client.post(
            '/project/new-issue',
            data=json.dumps(request),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 400)

    def test_update_issue(self):
        issue = Issue.objects.get(title="First Issue")
        repository = Repository.objects.get(name='Project Repository').id
        author = User.objects.get(given_name='John').id
        request = {
            "repository": repository,
            "title": "Update issue",
            "status": "OPEN",
            "author": author
            }
        response = self.client.put(
            '/project/update-issue/'+str(issue.id),
            data=json.dumps(request),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        res_obj = json.loads(response.content)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_obj['title'], 'Update issue')

    def test_upate_issue_fail(self):
        issue = Issue.objects.get(title="First Issue")
        repository = Repository.objects.get(name='Project Repository').id
        request = {
            "repository": repository,
            "title": "Update issue",
        }
        response = self.client.put(
            '/project/update-issue/'+str(issue.id),
            data=json.dumps(request),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 400)

    def test_delete_issue(self):
        issue = Issue.objects.get(title="First Issue")
        response = self.client.delete(
            '/project/delete-issue/'+str(issue.id),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 204)

    def test_delete_issue_fail(self):
        response = self.client.delete(
            '/project/delete-issue/98',
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 404)