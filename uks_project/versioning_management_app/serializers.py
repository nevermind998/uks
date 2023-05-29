from rest_framework import serializers
from .models import Repository, Branch


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
