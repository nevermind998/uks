from rest_framework import serializers

from users_management_app.models import User
from users_management_app.serializers import UserProfileSerializer

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
    assignees = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all(), required=False)
    milestone = serializers.PrimaryKeyRelatedField(queryset=Milestone.objects.all(), required=False)
    labels = serializers.PrimaryKeyRelatedField(many=True, queryset=Label.objects.all(), required=False)
    
    class Meta:
        model = Issue
        fields = ['id','title', 'created_at', 'status', 'milestone', 'labels', 'repository', 'author','assignees']
        read_only_field = ['id']

class GetFullIssueSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer()
    milestone = MilestoneSerializer()
    assignees = UserProfileSerializer(many=True)
    labels = LabelSerializer(many=True)
    class Meta:
        model = Issue
        fields = ['id','title', 'created_at', 'status', 'milestone', 'labels', 'repository', 'author','assignees']
        read_only_field = ['id']

class PullRequestSerializer(serializers.ModelSerializer):
    issues = serializers.PrimaryKeyRelatedField(many=True, queryset=Issue.objects.all(), required=False)
    assignees = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all(), required=False)
    milestone = serializers.PrimaryKeyRelatedField(queryset=Milestone.objects.all(), required=False)
    labels = serializers.PrimaryKeyRelatedField(many=True, queryset=Label.objects.all(), required=False)

    class Meta:
        model = PullRequest
        fields = ['id','author', 'repository', 'title', 'description', 'base_branch', 'compare_branch', 'issues','milestone','labels','assignees' ,'status' , 'review','created_at']
        read_only_field = ['id']

class GetFullPullRequestSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer()
    milestone = MilestoneSerializer()
    issues = IssueSerializer(many=True)
    assignees = UserProfileSerializer(many=True)
    labels = LabelSerializer(many=True)
    class Meta:
        model = PullRequest
        fields = ['id','author', 'repository', 'title', 'description', 'base_branch', 'compare_branch', 'issues','milestone','labels','assignees' ,'status' , 'review','created_at']
        read_only_field = ['id']

   
   

         