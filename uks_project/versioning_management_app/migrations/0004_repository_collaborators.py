# Generated by Django 4.2 on 2023-06-09 20:49

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('versioning_management_app', '0003_alter_branch_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='repository',
            name='collaborators',
            field=models.ManyToManyField(null=True, related_name='collaborators', through='versioning_management_app.Collaboration', to=settings.AUTH_USER_MODEL),
        ),
    ]
