from django.http import Http404
from rest_framework.response import Response
from .models import Comment, Reaction, Action
from .serializers import CommentSerializer, ReactionSerializer, ActionSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users_management_app.models import User
from users_management_app.serializers import UserSerializer
from versioning_management_app.models import Repository
from versioning_management_app.serializers import RepositorySerializer

#Comments Handling 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_comments(request):
    comments = Comment.objects.all()
    if(len(comments) == 0): raise Http404('No comments found that matches the given query.')
    serializers = CommentSerializer(comments,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pr_comments(request,pr_id):
    comments = Comment.objects.filter(pull_request=pr_id)
    if(len(comments) == 0): raise Http404('No comments found that matches the given query.')
    serializers = CommentSerializer(comments,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_issue_comments(request,issue_id):
    comments = Comment.objects.filter(issue=issue_id)
    if(len(comments) == 0): raise Http404('No comments found that matches the given query.')
    serializers = CommentSerializer(comments,many=True)
    return Response(serializers.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_new_comment(request):
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def delete_or_edit_comment(request,id):
    if request.method == 'DELETE':
        try:
            comment = Comment.objects.get(id=id)
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            comment = None
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    elif request.method == 'PUT':
        try:
            comment = Comment.objects.get(id=id)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = CommentSerializer(comment, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

#Reactions Handling 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_reactions(request):
    reactions = Reaction.objects.all()
    if(len(reactions) == 0): raise Http404('No reactions found that matches the given query.')
    serializers = ReactionSerializer(reactions,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_comment_reactions(request,comment_id):
    reactions = Reaction.objects.filter(comment=comment_id)
    if(len(reactions) == 0): raise Http404('No reactions found that matches the given query.')
    serializers = ReactionSerializer(reactions,many=True)
    return Response(serializers.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_new_reaction(request):
    serializer = ReactionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_reaction(request,id):
    try:
        reaction = Reaction.objects.get(id=id)
        reaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Reaction.DoesNotExist:
        reaction = None
        return Response(status=status.HTTP_404_NOT_FOUND)
    
#Actions Handling 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repo_stargazers(request,repo_id):
    star_actions = Action.objects.filter(repository=repo_id, type="STAR")
    if(len(star_actions) == 0): raise Http404('No stargazers found that matches the given query.')
    stargazers_ids = []
    for action in star_actions:
        stargazers_ids.append(action.author)
    stargazers = User.objects.filter(id__in=stargazers_ids)
    serializers = UserSerializer(stargazers,many=True)
    return Response(serializers.data) 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repo_watchers(request,repo_id):
    watch_actions = Action.objects.filter(repository=repo_id, type="WATCH")
    if(len(watch_actions) == 0): raise Http404('No watchers found that matches the given query.')
    watchers_ids = []
    for action in watch_actions:
        watchers_ids.append(action.author)
    watchers = User.objects.filter(id__in=watchers_ids)
    serializers = UserSerializer(watchers,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repo_forks(request,repo_id):
    fork_actions = Action.objects.filter(repository=repo_id, type="FORK")
    if(len(fork_actions) == 0): raise Http404('No forks found that matches the given query.')
    forked_repos_ids = []
    for action in fork_actions:
        forked_repos_ids.append(action.forked_repo)
    forked_repos = Repository.objects.filter(id__in=forked_repos_ids)
    serializers = RepositorySerializer(forked_repos,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_stars(request,user_id):
    star_actions = Action.objects.filter(author=user_id, type="STAR")
    if(len(star_actions) == 0): raise Http404('No stars found that matches the given query.')
    starred_repos_ids = []
    for action in star_actions:
        starred_repos_ids.append(action.repository)
    starred_repos = Repository.objects.filter(id__in=starred_repos_ids)
    serializers = RepositorySerializer(starred_repos,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_action_for_user(request,repo_id, user_id, action_type):
    action = Action.objects.filter(repository=repo_id,author=user_id,action=action_type)
    if(len(action) == 0): raise Http404('No action found that matches the given query.')
    serializers = ActionSerializer(action)
    return Response(serializers.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_new_action(request):
    serializer = ActionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_action(request,id):
    try:
        action = Action.objects.get(id=id)
        action.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Action.DoesNotExist:
        action = None
        return Response(status=status.HTTP_404_NOT_FOUND)
