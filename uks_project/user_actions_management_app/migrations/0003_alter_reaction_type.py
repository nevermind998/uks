# Generated by Django 4.2 on 2023-06-10 14:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_actions_management_app', '0002_action_forked_repo_alter_action_type_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reaction',
            name='type',
            field=models.CharField(choices=[('LIKE', 'Like'), ('DISLIKE', 'Dislike'), ('LOVE', 'Love'), ('HAPPY', 'Happy'), ('SAD', 'Sad')], max_length=10),
        ),
    ]
