from django.http import Http404
from rest_framework.response import Response
from .models import Comment, Reaction, Action
from .serializers import CommentSerializer, ReactionSerializer, ActionSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users_management_app.serializers import UserSerializer
from versioning_management_app.serializers import RepositorySerializer

#Comments Handling 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_comments(request):
    comments = Comment.objects.all()
    serializers = CommentSerializer(comments,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pr_comments(request,pr_id):
    comments = Comment.objects.filter(pull_request=pr_id)
    serializers = CommentSerializer(comments,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_issue_comments(request,issue_id):
    comments = Comment.objects.filter(issue=issue_id)
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
    serializers = ReactionSerializer(reactions,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_comment_reactions(request,comment_id):
    reactions = Reaction.objects.filter(comment=comment_id)
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
    stargazers = []
    for action in star_actions:
        stargazers.append(action.author)
    serializers = UserSerializer(stargazers,many=True)
    return Response(serializers.data) 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repo_watchers(request,repo_id):
    watch_actions = Action.objects.filter(repository=repo_id, type="WATCH")
    watchers = []
    for action in watch_actions:
        watchers.append(action.author)
    serializers = UserSerializer(watchers,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repo_forks(request,repo_id):
    fork_actions = Action.objects.filter(repository=repo_id, type="FORK")
    forked_repos = []
    for action in fork_actions:
        forked_repos.append(action.forked_repo)
    serializers = RepositorySerializer(forked_repos,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_stars(request,user_id):
    star_actions = Action.objects.filter(author=user_id, type="STAR")
    starred_repos = []
    for action in star_actions:
        starred_repos.append(action.repository)
    serializers = RepositorySerializer(starred_repos,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_action_for_user(request,repo_id, user_id, action_type):
    action = Action.objects.filter(repository=repo_id,author=user_id,type=action_type.upper())
    serializers = ActionSerializer(action.first())
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
