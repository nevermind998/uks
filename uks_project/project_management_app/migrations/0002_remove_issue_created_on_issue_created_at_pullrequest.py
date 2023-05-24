# Generated by Django 4.2.1 on 2023-05-24 17:50

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('users_management_app', '0001_initial'),
        ('project_management_app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='issue',
            name='created_on',
        ),
        migrations.AddField(
            model_name='issue',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='PullRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=250)),
                ('description', models.CharField(max_length=500)),
                ('status', models.CharField(choices=[('OPEN', 'Open'), ('CLOSED', 'Closed')], max_length=6)),
                ('review', models.CharField(choices=[('APPROVED', 'Open'), ('CHANGES_REQUESTED', 'Changes Requested')], max_length=20)),
                ('assignees', models.ManyToManyField(null=True, related_name='pr_assignees', to='users_management_app.user')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pr_author', to='users_management_app.user')),
            ],
        ),
    ]
