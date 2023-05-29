from rest_framework import serializers
from .models import Repository

# File to define Serializers for versioning_management_app

class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = [ "id", "name", "owner", "description", "created_at", "visibility", "default_branch"]
        read_only_field = ['id']
