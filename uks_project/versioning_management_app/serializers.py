from rest_framework import serializers

from users_management_app.serializers import UserProfileSerializer
from .models import Collaboration, Repository, Branch, Commit

class RepositorySerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True)
    class Meta:
        model = Repository
        fields = ['id', 'name', 'owner', 'description', 'created_at', 'visibility', 'default_branch', 'collaborators']
        read_only_field = ['id']

class CollaborationSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()
    class Meta:
        model = Collaboration
        fields = ['id', 'user', 'role']
        read_only_field = ['id']

class UpdateCollaborationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collaboration
        fields = ['id', 'user', 'role', 'repository']
        read_only_field = ['id', 'user', 'repository']

class GetFullRepository(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True)
    owner = UserProfileSerializer()
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
    hash = serializers.CharField(required=False, allow_blank=True)
    class Meta:
        model = Commit
        fields = ['id', 'author', 'hash', 'message', 'created_at', 'branch']
        read_only_field = ['id']

class GetFullCommitSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer()
    class Meta:
        model = Commit
        fields = ['id', 'author', 'hash', 'message', 'created_at', 'branch']
        read_only_field = ['id']
