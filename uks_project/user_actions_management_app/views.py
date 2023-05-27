from django.shortcuts import render
from django.http import Http404
from rest_framework.response import Response
from .models import Comment
from .serializers import CommentSerializer

from rest_framework.decorators import api_view

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
    return

@api_view(['DELETE'])
def delete_comment_by_id(request,id):
    return

@api_view(['UPDATE'])
def edit_comment_by_id(request,id):
    return