from datetime import datetime, timedelta
import uuid
from django.shortcuts import render
from django.http import HttpResponse, Http404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from collections import Counter

from django.db.models import Q

from users_management_app.models import User

from .models import Collaboration, Repository, Branch, Commit
from .serializers import CollaborationSerializer, GetFullCommitSerializer, GetFullRepository, RepositorySerializer, BranchSerializer, CommitSerializer, UpdateCollaborationSerializer


# Repo handling

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_repositories(request):
    repositories = Repository.objects.all()
    serializer = RepositorySerializer(repositories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repository_by_id(request,id):
    try:
        milestone= Repository.objects.get(id=id)
        serializers = RepositorySerializer(milestone)
        return Response(serializers.data)
    except RepositorySerializer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

  
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
def get_repo_by_id(request, id):
    repository = Repository.objects.filter(id=id)
    if len(repository) == 0:
        raise Http404('No repositories found with that id.')
    serializer = GetFullRepository(repository, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repos_by_owner(request, id):
    try:
        repositories = Repository.objects.filter(owner=id)
        serializer = RepositorySerializer(repositories, many=True)
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_new_repository(request):
    serializer = RepositorySerializer(data=request.data)
    if serializer.is_valid():
        repository = serializer.save()
        default_branch = request.data.get('default_branch')
        Branch.objects.create(name=default_branch, repository=repository)
            
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def contains_integers(arr):
    for item in arr:
        if isinstance(item, int):
            return True
    return False

@api_view(['DELETE', 'PUT', 'GET'])
@permission_classes([IsAuthenticated])
def delete_or_edit_repository(request, id):
    if request.method == 'GET':
        repository = Repository.objects.get(id=id)
        serializer = GetFullRepository(repository)
        return Response(serializer.data)
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

            collaborators_data = request.data.get('collaborators', [])
            if not contains_integers(collaborators_data):
                for collaborator_data in collaborators_data:
                    collaborator = User.objects.get(id=collaborator_data['id'])
                    role = collaborator_data['role']
                    Collaboration.objects.create(user=collaborator, repository=repository, role=role)

            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_branches(request):
    try:
        branches = Branch.objects.all()
        serializer = BranchSerializer(branches, many=True)
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)


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
def get_branch_by_name_and_repository(request, repository):
    name = request.GET.get('name')
    branch = Branch.objects.get(name=name, repository=repository)
    if not branch:
        raise Http404('No branch found with that name.')
    serializer = BranchSerializer(branch)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_branch_by_id(request, id):
    branch = Branch.objects.filter(id=id)
    if not branch:
        return Response([])
    serializer = BranchSerializer(branch, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repository_branches(request, id):
    branches = Branch.objects.filter(repository=id)
    if not branches:
        return Response([])
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
    try:
        commits = Commit.objects.all()
        serializer = CommitSerializer(commits, many=True)
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)


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
def get_commit_branch(request, branch):
    commits = Commit.objects.filter(branch=branch)
    if len(commits) == 0:
        return Response([])
    serializer = GetFullCommitSerializer(commits, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_new_commit(request):
    serializer = CommitSerializer(data=request.data)
    if serializer.is_valid():
        hash = uuid.uuid4().hex
        serializer.validated_data['hash'] = hash
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
    try:
        commits = Commit.objects.filter(author=user_id)
        author_commits = []
        for commit in commits:
            author_commits.append(commit.branch)
        serializer = CommitSerializer(commits, many=True)
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_collaborator_role(request, id, repository):
    try:
        collaboration = Collaboration.objects.get(user_id=id, repository_id=repository)
        serializer = CollaborationSerializer(collaboration)
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def manage_roles(request, id, repository):
    try:
        collaboration = Collaboration.objects.get(user_id=id, repository_id=repository)
    except Branch.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = UpdateCollaborationSerializer(collaboration, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_collaborator(request, user_id, repository):
    try:
        collaboration = Collaboration.objects.get(user_id=user_id, repository_id=repository)
        collaboration.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Collaboration.DoesNotExist:
        collaboration = None
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def commit_activity(request, id):
    branches = Branch.objects.filter(repository_id=id)
    allCommits = []
    for branch in branches:
        commits = Commit.objects.filter(branch_id=branch.id)
        for commit in commits:
            var = {'user' : commit.author.username, 'commit' : commit.id}
            allCommits.append(var)
    
    commit_counts = Counter(commit['user'] for commit in allCommits)
    commit_activity = [{'username': username, 'commits': count} for username, count in commit_counts.items()]
    return Response(commit_activity)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_commit_counts(request, id):
    # Calculate the date range for the past seven days
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=6)

    # Create a dictionary to store commit counts for each day
    commit_counts = {}

    branches = Branch.objects.filter(repository_id=id)
    allCommits = []
    for branch in branches:
        commits = Commit.objects.filter(branch_id=branch.id)
        for commit in commits:
            var = {'created_at' : commit.created_at, 'commit' : commit.id}
            allCommits.append(var)

    # Iterate through the commits and count them based on the created_at date
    for commit in allCommits:
        created_at = commit['created_at'].date()

        if start_date <= created_at <= end_date:
            if created_at in commit_counts:
                commit_counts[created_at] += 1
            else:
                commit_counts[created_at] = 1

    # Create an array of objects with date and commit count
    commit_data = [{'date': date, 'commit_count': count} for date, count in commit_counts.items()]

    return Response(commit_data)