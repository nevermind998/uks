from django.test import Client, TestCase
from django.urls import reverse

from ..models import User

from ..management.set_up_database import Command

# Create your tests here.


class SignInTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        c = Command()
        c.handle()

    def test_successful_get_user(self):
        u = User.objects.all()[0]
        name = u._meta.get_field("email").value_from_object(u)
        self.assertEqual(name, "johndoe@test.com")

    def test_create_new_user(self):
        new_user = User.objects.create_user(
            given_name="Ana",
            family_name="Ivanovic",
            username="anaIvanovic",
            email="anaIvanovic@test.com",
            password="123",
            bio="Ja sam Ana",
            url="sajt.com",
        )

        self.assertEqual(new_user.email, "anaIvanovic@test.com")
