from rest_framework import serializers
from .models import Comment

# File to define Serializers for user_actions_management_app

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [ "pk", "author", "created_at", "updated_at", "content" ,"issue", "pull_request"]