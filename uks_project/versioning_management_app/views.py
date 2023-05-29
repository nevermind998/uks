from django.shortcuts import render
from django.http import HttpResponse, Http404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from uks_project.versioning_management_app.models import Repository
from uks_project.versioning_management_app.serializers import RepositorySerializer


# Repo handling

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_repositories(request):
    repositories = Repository.objects.all()
    if len(repositories) == 0:
        raise Http404('No repositories found that matches the given query.')
    serializer = RepositorySerializer(repositories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repo_by_name(request, name):
    repository = Repository.objects.filter(name=name)
    if len(repository) == 0:
        raise Http404('No repositories found with that name.')
    serializer = RepositorySerializer(repository, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repos_by_owner(request, owner_id):
    repositories = Repository.objects.filter(owner=owner_id)
    if len(repositories) == 0:
        raise Http404('No repositories found with that owner.')
    serializer = RepositorySerializer(repositories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repository_collaborators(request, repository_id):
    try:
        repository = Repository.objects.get(id=repository_id)
        collaborators = repository.collaborators.all()
        serializer = RepositorySerializer(collaborators, many=True)
        return Response(serializer.data)
    except Repository.DoesNotExist:
        raise Http404('No repositories found that match the given query.')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_new_repository(request):
    serializer = RepositorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def delete_or_edit_repository(request, id):
    if request.method == 'DELETE':
        try:
            repository = Repository.objects.get(id=id)
            repository.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Repository.DoesNotExist:
            repository = None
            return Response(status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'PUT':
        try:
            repository = Repository.objects.get(id=id)
        except Repository.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = RepositorySerializer(repository, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
