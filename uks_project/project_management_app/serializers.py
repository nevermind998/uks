from rest_framework import serializers
from .models import Milestone, Label, Issue, PullRequest
from rest_framework_simplejwt.tokens import AccessToken

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id','title', 'due_date', 'description', 'status', 'repository']
        read_only_field = ['id']

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['id','name', 'description', 'color', 'repository']
        read_only_field = ['id']

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['id','title', 'created_at', 'status', 'milestone', 'labels', 'repository', 'author','assignees']
        read_only_field = ['id']

class PullRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PullRequest
        fields = ['id','author', 'repository', 'title', 'description', 'base_branch', 'compare_branch', 'issues','milestone','labels','assignees' ,'status' , 'review','created_at']
        read_only_field = ['id']

   
   

         