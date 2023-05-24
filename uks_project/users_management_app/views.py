from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.permissions import AllowAny
from rest_framework import generics

from .models import User
from .serializers import UserSerializer

# Create your views here.

def main(request):
    return HttpResponse("Users Management")

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]