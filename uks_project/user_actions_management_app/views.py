from django.shortcuts import render
from django.http import Http404
from rest_framework.response import Response
from .models import Comment
from .serializers import CommentSerializer
from rest_framework.decorators import api_view
from rest_framework import status

# Create your views here.

#Comments Handling 

@api_view(['GET'])
def get_all_comments(request):
    comments= Comment.objects.all()
    if(len(comments) == 0): raise Http404('No Comments matches the given query.')
    serializers=CommentSerializer(comments,many=True)
    return Response(serializers.data)

@api_view(['GET'])
def get_pr_comments(request,pr_id):
    comments= Comment.objects.filter(issue=pr_id)
    if(len(comments) == 0): raise Http404('No Comments matches the given query.')
    serializers=CommentSerializer(comments,many=True)
    return Response(serializers.data)

@api_view(['GET'])
def get_issue_comments(request,issue_id):
    comments= Comment.objects.filter(issue=issue_id)
    if(len(comments) == 0): raise Http404('No Comments matches the given query.')
    serializers=CommentSerializer(comments,many=True)
    return Response(serializers.data)


@api_view(['POST'])
def add_new_comment(request,id=None):
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_comment_by_id(request,id):
    try:
        reaction = Comment.objects.get(comment=id)
        reaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Comment.DoesNotExist:
        reaction = None
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def edit_comment_by_id(request,id):
    try:
        snippet = Comment.objects.get(pk=id)
    except Comment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = Comment(snippet, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
