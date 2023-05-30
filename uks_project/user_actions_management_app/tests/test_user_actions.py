from django.test import Client, TestCase
from django.urls import reverse

from ..management.set_up_database import Command
import json
from ..models import User, Issue, Comment, Reaction

#Integration Tests

JSON = 'application/json'

def get_jwt_token():
    client = Client()
    credentials = {"email": "johndoe@test.com", "password": "123"}
    response = client.post(reverse("sign-in"), credentials)
    y = json.loads(response.content)
    return  y.get("access_token", None)

class CommentsApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def setUp(self) -> None:
        self.client = Client()
        self.token = f'Bearer {get_jwt_token()}'
    
    def test_get_all_comments(self):
        response = self.client.get('/user-actions/comments/', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(res_obj),1)

    def test_get_all_comments_wrong_path(self):
        response = self.client.get('/user-actions/comment', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)
    
    def test_get_all_comments_unauth(self):
        response = self.client.get('/user-actions/comments/', HTTP_AUTHORIZATION="", content_type=JSON)
        self.assertEqual(response.status_code, 401)

    def test_get_issue_comments(self):
        issue = Issue.objects.get(title="First Issue").id
        response = self.client.get('/user-actions/issue/'+str(issue)+'/comments', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(res_obj),1)
    
    def test_get_issue_comments_fail(self):
        response = self.client.get('/user-actions/issue/55/comments', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)

    def test_post_create_comment(self):
        author = User.objects.get(username="johndoe").id
        issue = Issue.objects.get(title="First Issue").id
        comment = {
        "content": "New Comment",
        "author": author,
        "issue": issue
        }

        response = self.client.post(
            '/user-actions/new-comment',
            data=json.dumps(comment),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )
        res_obj = json.loads(response.content)
       
        self.assertEqual(response.status_code, 201)
        self.assertEqual(res_obj['content'], 'New Comment')
    
    def test_post_create_comment_fail(self):
        issue = Issue.objects.get(title="First Issue").id
        comment = {
        "content": "Fail Comment",
        "issue": issue
        }
        
        response = self.client.post(
            '/user-actions/new-comment',
            data=json.dumps(comment),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 400)
    
    def test_delete_comment(self):
        comment = Comment.objects.get(content="Jane please finish this issue by this Friday. Thanks.").id
        response = self.client.delete(
            '/user-actions/comments/'+str(comment),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 204)

    def test_delete_comment_fail(self):
        response = self.client.delete(
            '/user-actions/comments/99',
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 404)
    
    def test_edit_comment(self):
        comment = Comment.objects.get(content="Jane please finish this issue by this Friday. Thanks.")
        new_content = {
            "content" : "New Content.",
            "author" : comment.author.id
            }
        response = self.client.put(
            '/user-actions/comments/'+str(comment.id),
            data=json.dumps(new_content),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        res_obj = json.loads(response.content)
       
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_obj['content'], 'New Content.')
    
    def test_edit_comment_fail(self):
        comment = Comment.objects.get(content="Jane please finish this issue by this Friday. Thanks.")
        new_content = {
            "content" : "New Content.",
            }
        response = self.client.put(
            '/user-actions/comments/'+str(comment.id),
            data=json.dumps(new_content),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
       
        self.assertEqual(response.status_code, 400)

class ReactionsApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def setUp(self) -> None:
        self.client = Client()
        self.token = f'Bearer {get_jwt_token()}'
    
    def test_get_all_reactions(self):
        response = self.client.get('/user-actions/reactions/', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(res_obj),1)

    def test_get_all_reactions_wrong_path(self):
        response = self.client.get('/user-actions/reaction', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)
    
    def test_get_all_reactions_unauth(self):
        response = self.client.get('/user-actions/reactions/', HTTP_AUTHORIZATION="", content_type=JSON)
        self.assertEqual(response.status_code, 401)

    def test_get_comment_reactions(self):
        comment = Comment.objects.get(content="Jane please finish this issue by this Friday. Thanks.").id
        response = self.client.get('/user-actions/comment/'+str(comment)+'/reactions', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        res_obj = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(res_obj),1)
    
    def test_get_comment_reactions_fail(self):
        response = self.client.get('/user-actions/comment/55/reactions', HTTP_AUTHORIZATION=self.token, content_type=JSON)
        self.assertEqual(response.status_code, 404)
    
    def test_post_create_reaction(self):
        author = User.objects.get(username="johndoe").id
        comment = Comment.objects.get(content="Jane please finish this issue by this Friday. Thanks.").id
        reaction = {
        "type": "DISLIKE",
        "author": author,
        "comment": comment
        }

        response = self.client.post(
            '/user-actions/new-reaction',
            data=json.dumps(reaction),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )
        res_obj = json.loads(response.content)
       
        self.assertEqual(response.status_code, 201)
        self.assertEqual(res_obj['type'], 'DISLIKE')
    
    def test_post_create_reaction(self):
        author = User.objects.get(username="johndoe").id
        comment = Comment.objects.get(content="Jane please finish this issue by this Friday. Thanks.").id
        reaction = {
        "type": "random",
        "author": author,
        "comment": comment
        }

        response = self.client.post(
            '/user-actions/new-reaction',
            data=json.dumps(reaction),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 400)
    
    
    def test_delete_reaction(self):
        reaction = Reaction.objects.get(type="LIKE").id
        response = self.client.delete(
            '/user-actions/reactions/'+str(reaction),
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 204)

    def test_delete_reaction_fail(self):
        response = self.client.delete(
            '/user-actions/reactions/99',
            HTTP_AUTHORIZATION=self.token,
            content_type=JSON
        )       
        self.assertEqual(response.status_code, 404)
    



