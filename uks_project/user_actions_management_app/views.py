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
    if(len(comments) == 0): raise Http404('No comments found that matches the given query.')
    serializers=CommentSerializer(comments,many=True)
    return Response(serializers.data)

@api_view(['GET'])
def get_pr_comments(request,pr_id):
    comments= Comment.objects.filter(pull_request=pr_id)
    if(len(comments) == 0): raise Http404('No comments found that matches the given query.')
    serializers=CommentSerializer(comments,many=True)
    return Response(serializers.data)

@api_view(['GET'])
def get_issue_comments(request,issue_id):
    comments= Comment.objects.filter(issue=issue_id)
    if(len(comments) == 0): raise Http404('No comments found that matches the given query.')
    serializers=CommentSerializer(comments,many=True)
    return Response(serializers.data)


@api_view(['POST'])
def add_new_comment(request,id=None):
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE', 'PUT'])
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
    
