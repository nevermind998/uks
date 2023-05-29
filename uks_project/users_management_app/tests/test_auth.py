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

    def setUp(self) -> None:
        self.client = Client()

    def test_successful_login(self):
        john_doe = User.objects.filter(email="johndoe@test.com").first()
        self.assertIsNotNone(john_doe)

        credentials = {"email": "johndoe@test.com", "password": "123"}
        response = self.client.post(reverse("sign-in"), credentials)

        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data["access_token"])
        self.assertEqual(response.data["user"]["email"], "johndoe@test.com")
        self.assertEqual(response.data["user"]["username"], "johndoe")

    def test_unsuccessful_login(self):
        credentials = {"email": "johndoe@test.com", "password": "1234"}
        response = self.client.post(reverse("sign-in"), credentials)

        self.assertEqual(response.status_code, 400)

    def test_successful_signup(self):
        test_user = {
            "given_name": "Mary",
            "family_name": "Angela",
            "username": "maryangela",
            "email": "maryangela@test.com",
            "password": "123",
        }

        response = self.client.post(reverse("user-registration"), test_user)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["email"], "maryangela@test.com")
        self.assertEqual(response.data["username"], "maryangela")

    def test_unsuccessful_signup(self):
        test_user = {
            "given_name": "Mary",
            "family_name": "Angela",
            "username": "maryangela",
            "email": "johndoe@test.com",
            "password": "123",
        }

        response = self.client.post(reverse("user-registration"), test_user)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["email"][0].code, "unique")
