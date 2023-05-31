from django.shortcuts import render
from .models import Milestone, Label, Issue, PullRequest
from django.http import Http404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import IssueSerializer, LabelSerializer, MilestoneSerializer, PullRequestSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

#Milestone Handling
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_milestone(request,id):
    try:
        milestone= Milestone.objects.get(id=id)
        serializers = MilestoneSerializer(milestone)
        return Response(serializers.data)
    except Milestone.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_milestone_by_repository(request,repository):
    try:
        milestone= Milestone.objects.get(repository=repository)
        serializers = MilestoneSerializer(milestone)
        return Response(serializers.data)
    except Milestone.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_milestone(request,id=None):
    milestones = Milestone.objects.all()
    if(len(milestones) == 0): raise Http404('No milestones found that matches the given query.')
    serializers = MilestoneSerializer(milestones,many=True)
    return Response(serializers.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_new_milestone(request,id=None):
    serializer = MilestoneSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_milestone(request,id):
    try:
        milestone= Milestone.objects.get(id=id)
    except Milestone.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = MilestoneSerializer(milestone, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_milestone(request,id):
    try:
        milestone = Milestone.objects.get(id=id)
        milestone.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Milestone.DoesNotExist:
        milestone = None
        return Response(status=status.HTTP_404_NOT_FOUND)
    
#Label Handling
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_label(request,id):
    try:
        label= Label.objects.get(id=id)
        serializers = LabelSerializer(label)
        return Response(serializers.data)
    except Label.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def label_by_color(request,color):
    label = Label.objects.filter(color=color)
    if(len(label) == 0): raise Http404('No label found that matches the given query.')
    serializers = LabelSerializer(label,many=True)
    return Response(serializers.data)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_label(request,id=None):
    labels = Label.objects.all()
    if(len(labels) == 0): raise Http404('No labels found that matches the given query.')
    serializers = LabelSerializer(labels,many=True)
    return Response(serializers.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_new_label(request,id=None):
    serializer = LabelSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_label(request,id):
    try:
        label= Label.objects.get(id=id)
    except Label.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = LabelSerializer(label, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_label(request,id):
    try:
        label = Label.objects.get(id=id)
        label.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Label.DoesNotExist:
        label = None
        return Response(status=status.HTTP_404_NOT_FOUND)
    
#Issue Handling
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_issue(request,id):
    try:
        issue= Issue.objects.get(id=id)
        serializers = IssueSerializer(issue)
        return Response(serializers.data)
    except Issue.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_issue(request,id=None):
    issues = Issue.objects.all()
    if(len(issues) == 0): raise Http404('No issues found that matches the given query.')
    serializers = IssueSerializer(issues,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issues_by_status(request,status):
    isuess = Issue.objects.filter(status=status)
    if(len(isuess) == 0): raise Http404('No isuess found that matches the given query.')
    serializers = IssueSerializer(isuess,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issues_by_author(request,author):
    isuess = Issue.objects.filter(author=author)
    if(len(isuess) == 0): raise Http404('No isuess found that matches the given query.')
    serializers = IssueSerializer(isuess,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issues_by_label(request,label):
    isuess = Issue.objects.filter(labels=label)
    if(len(isuess) == 0): raise Http404('No isuess found that matches the given query.')
    serializers = IssueSerializer(isuess,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issues_by_milestone(request,milestone):
    isuess = Issue.objects.filter(milestone=milestone)
    if(len(isuess) == 0): raise Http404('No isuess found that matches the given query.')
    serializers = IssueSerializer(isuess,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issues_by_assignee(request,assignee):
    isuess = Issue.objects.filter(assignees=assignee)
    if(len(isuess) == 0): raise Http404('No isuess found that matches the given query.')
    serializers = IssueSerializer(isuess,many=True)
    return Response(serializers.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_new_issue(request,id=None):
    serializer = IssueSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_issue(request,id):
    try:
        issue= Issue.objects.get(id=id)
    except Issue.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = IssueSerializer(issue, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_issue(request,id):
    try:
        issue = Issue.objects.get(id=id)
        issue.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Issue.DoesNotExist:
        issue = None
        return Response(status=status.HTTP_404_NOT_FOUND)
    
#PullRequest Handling
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pull_request(request,id):
    try:
        pull_request= PullRequest.objects.get(id=id)
        serializers = PullRequestSerializer(pull_request)
        return Response(serializers.data)
    except PullRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_pull_request(request,id=None):
    pull_requests = PullRequest.objects.all()
    if(len(pull_requests) == 0): raise Http404('No pull requests found that matches the given query.')
    serializers = PullRequestSerializer(pull_requests,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pull_request_by_status(request,status):
    pull_requests = PullRequest.objects.filter(status=status)
    if(len(pull_requests) == 0): raise Http404('No pull requests found that matches the given query.')
    serializers = PullRequestSerializer(pull_requests,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pull_request_by_review(request,review):
    pull_requests = PullRequest.objects.filter(review=review)
    if(len(pull_requests) == 0): raise Http404('No pull requests found that matches the given query.')
    serializers = PullRequestSerializer(pull_requests,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pull_requests_by_author(request,author):
    pull_requests = PullRequest.objects.filter(author=author)
    if(len(pull_requests) == 0): raise Http404('No pull requests found that matches the given query.')
    serializers = PullRequestSerializer(pull_requests,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pull_requests_by_label(request,label):
    pull_requests = PullRequest.objects.filter(labels=label)
    if(len(pull_requests) == 0): raise Http404('No pull requests found that matches the given query.')
    serializers = PullRequestSerializer(pull_requests,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pull_requests_by_milestone(request,milestone):
    pull_requests = PullRequest.objects.filter(milestone=milestone)
    if(len(pull_requests) == 0): raise Http404('No pull requests found that matches the given query.')
    serializers = PullRequestSerializer(pull_requests,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pull_requests_by_assignee(request,assignee):
    pull_requests = PullRequest.objects.filter(assignees=assignee)
    if(len(pull_requests) == 0): raise Http404('No pull requests found that matches the given query.')
    serializers = PullRequestSerializer(pull_requests,many=True)
    return Response(serializers.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_new_pull_request(request,id=None):
    serializer = PullRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_pull_request(request,id):
    try:
        pull_request= PullRequest.objects.get(id=id)
    except PullRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = PullRequestSerializer(pull_request, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_pull_request(request,id):
    try:
        pull_request = PullRequest.objects.get(id=id)
        pull_request.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except PullRequest.DoesNotExist:
        pull_request = None
        return Response(status=status.HTTP_404_NOT_FOUND)


