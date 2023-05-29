from rest_framework import serializers
from .models import Milestone
from rest_framework_simplejwt.tokens import AccessToken

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id','title', 'due_date', 'description', 'status', 'repository']
        read_only_field = ['id']
    