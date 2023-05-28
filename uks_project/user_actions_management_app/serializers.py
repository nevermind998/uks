from rest_framework import serializers
from .models import Comment, Reaction

# File to define Serializers for user_actions_management_app

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [ "id", "author", "created_at", "updated_at", "content" ,"issue", "pull_request"]
        read_only_field = ['id']

class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = [ "id", "author", "comment", "type"]
        read_only_field = ['id']
