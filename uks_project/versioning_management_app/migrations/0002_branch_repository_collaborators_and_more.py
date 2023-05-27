# Generated by Django 4.2.1 on 2023-05-24 17:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users_management_app', '0001_initial'),
        ('versioning_management_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Branch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.AddField(
            model_name='repository',
            name='collaborators',
            field=models.ManyToManyField(null=True, related_name='collaborators', to='users_management_app.user'),
        ),
        migrations.AddField(
            model_name='repository',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='repository',
            name='default_branch',
            field=models.CharField(default='main', max_length=100),
        ),
        migrations.AddField(
            model_name='repository',
            name='description',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AddField(
            model_name='repository',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner', to='users_management_app.user'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='repository',
            name='visibility',
            field=models.CharField(choices=[('PUBLIC', 'Public'), ('PRIVATE', 'Private')], max_length=10),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Commit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hash', models.CharField(max_length=500)),
                ('message', models.CharField(max_length=250, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='commit_author', to='users_management_app.user')),
                ('branch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='versioning_management_app.branch')),
            ],
        ),
        migrations.AddField(
            model_name='branch',
            name='repository',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='versioning_management_app.repository'),
        ),
    ]