from rest_framework import serializers
from .models import Milestone, Label
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