from django.shortcuts import render
from django.http import HttpResponse, Http404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Repository, Branch, Commit
from .serializers import RepositorySerializer, BranchSerializer, CommitSerializer


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
def get_repos_by_owner(request, id):
    repositories = Repository.objects.filter(owner=id)
    serializer = RepositorySerializer(repositories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repository_collaborators(request, repo_id):
    try:
        repository = Repository.objects.get(id=repo_id)
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_branches(request):
    branches = Branch.objects.all()
    if len(branches) == 0:
        raise Http404('No branches found that matches the given query.')
    serializer = BranchSerializer(branches, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_branch_by_name(request, name):
    branch = Branch.objects.filter(name=name)
    if len(branch) == 0:
        raise Http404('No branch found with that name.')
    serializer = BranchSerializer(branch, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_branch_by_id(request, id):
    branch = Branch.objects.filter(id=id)
    if len(branch) == 0:
        raise Http404('No branch found with that id.')
    serializer = BranchSerializer(branch, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repository_branches(request, id):
    branches = Branch.objects.filter(repository=id)
    if len(branches) == 0:
        raise Http404('No branch found that matches the given query.')
    serializer = BranchSerializer(branches, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_new_branch(request):
    serializer = BranchSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_branch(request, id):
    try:
        branch = Branch.objects.get(id=id)
        branch.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Branch.DoesNotExist:
        branch = None
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def rename_branch(request, id):
    try:
        branch = Branch.objects.get(id=id)
    except Branch.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = BranchSerializer(branch, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_commits(request):
    commits = Commit.objects.all()
    if len(commits) == 0:
        raise Http404('No commits found that matches the given query.')
    serializer = CommitSerializer(commits, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_commit_message(request, message):
    commit = Commit.objects.filter(message=message)
    if len(commit) == 0:
        raise Http404('No commit found with that name.')
    serializer = CommitSerializer(commit, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_commit_branch(request, commit_id):
    commit = Commit.objects.filter(commit=commit_id)
    if len(commit) == 0:
        raise Http404('No commit found that matches given query.')
    serializer = CommitSerializer(commit, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_new_commit(request):
    serializer = CommitSerializer(data=request.data)
    if serializer.is_valid():
        hash_value = serializer.validated_data.get('hash')
        import bcrypt
        hashed_hash = bcrypt.hashpw(hash_value.encode('utf-8'), bcrypt.gensalt())
        serializer.validated_data['hash'] = hashed_hash.decode('utf-8')
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_commit_hash(request, commit_id):
    commit = Commit.objects.filter(commit=commit_id)
    if len(commit) == 0:
        raise Http404('No commit found with that hash.')
    serializer = CommitSerializer(commit, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_commits_by_author(request, user_id):
    commits = Commit.objects.filter(author=user_id)
    if len(commits) == 0:
        raise Http404('No commits found by that author.')

    author_commits = []
    for commit in commits:
        author_commits.append(commit.branch)
    serializer = CommitSerializer(commits, many=True)
    return Response(serializer.data)
