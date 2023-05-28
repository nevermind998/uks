
from django.core.management.base import BaseCommand

from ..models import User

class Command(BaseCommand):
    def insert_users(self):
        User.objects.all().delete()

        user1 = User.objects.create_user(id=1, given_name='John', family_name='Doe', username='johndoe', email='johndoe@test.com', password='123')
        user2 = User.objects.create_user(id=2, given_name='Jane', family_name='Doe', username='janedoe', email='janedoe@test.com', password='123')

    def handle(self, *args, **options):
        self.insert_users()