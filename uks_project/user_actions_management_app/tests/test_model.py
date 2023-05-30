from django.test import Client, TestCase
from django.urls import reverse

from ..management.set_up_database import Command
from ..models import Comment, User, Issue, Reaction

#Unit Tests

class CommentsTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def test_create_new_comment(self):
        author = User.objects.filter(username="janedoe").first()
        issue = Issue.objects.filter(title="First Issue").first()
        new_comment = Comment.objects.create(author=author, content="Alright John, will do.",  issue=issue)
        new_comment.save()
        self.assertEqual(new_comment.content,"Alright John, will do.")
        self.assertEqual(new_comment.author.given_name,"Jane")
        self.assertEqual(new_comment.issue.repository.name,"Project Repository")

    def test_successful_get_comments(self):
        comments = Comment.objects.all()
        self.assertEqual(len(comments), 1)  
        self.assertEqual(comments[0].content, "Jane please finish this issue by this Friday. Thanks.")

    def test_add_new_reaction(self):
        author = User.objects.filter(username="janedoe").first()
        comment = Comment.objects.filter(content="Jane please finish this issue by this Friday. Thanks.").first()
        new_reaction = Reaction.objects.create(author=author, comment=comment,  type="LOVE")
        new_reaction.save()
        self.assertEqual(new_reaction.type,"LOVE")
        self.assertEqual(new_reaction.author.given_name,"Jane")
        self.assertEqual(new_reaction.comment.id, comment.id)

    def test_successful_get_reactions(self):
        reactions = Reaction.objects.all()
        self.assertEqual(len(reactions), 1)  
        self.assertEqual(reactions[0].type, "LIKE")  