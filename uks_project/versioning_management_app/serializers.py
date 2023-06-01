from rest_framework import serializers
from .models import Repository, Branch, Commit


class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = ['id', 'name', 'owner', 'description', 'created_at', 'visibility', 'default_branch', 'collaborators']
        read_only_field = ['id']


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name', 'repository']
        read_only_field = ['id']


class CommitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commit
        fields = ['id', 'author', 'hash', 'message', 'created_at', 'branch']
        read_only_field = ['id']
