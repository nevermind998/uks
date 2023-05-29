from rest_framework import serializers
from .models import Repository

class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = ['pk', 'name', 'owner', 'description', 'created_at', 'visibility', 'default_branch', 'collaborators']
        read_only_field = ['pk']