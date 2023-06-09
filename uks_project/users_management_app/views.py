from django.http import HttpResponse, Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from versioning_management_app.models import Repository


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
def get_user_by_id(request, id):
    user = User.objects.filter(id=id)
    if len(user) == 0:
        raise Http404('No repositories found with that id.')
    serializer = UserSerializer(user, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pr_assignees(request, id):
    try:
        repository = Repository.objects.get(id=id)
        assignees = repository.collaborators.all()
        serializer = UserSerializer(assignees, many=True)
        return Response(serializer.data)
    except Repository.DoesNotExist:
        raise Http404('No repository found with that id.')

