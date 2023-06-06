from django.http import HttpResponse
from rest_framework.permissions import AllowAny
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from django.http import Http404

from .models import User
from .serializers import UserSerializer, CustomTokenObtainPairSerializer

# Create your views here.

def main(request):
    return HttpResponse("Users Management")

# example of an authorized route, if only the admin can access it use permissions.IsAdminUser
class HelloView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response("Hello")

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data, status=200)
    
    @api_view(['GET'])
    @permission_classes([IsAuthenticated])
    def GetAllUsers(request,id=None):
        pull_requests = User.objects.all()
        if(len(pull_requests) == 0): raise Http404('No users found that matches the given query.')
        serializers = UserSerializer(pull_requests,many=True)
        return Response(serializers.data)