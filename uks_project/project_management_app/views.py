from django.shortcuts import render
from .models import Milestone, Label, Issue, PullRequest
from django.http import Http404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import GetFullIssueSerializer, GetFullPullRequestSerializer, IssueSerializer, LabelSerializer, MilestoneSerializer, PullRequestSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

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
def get_milestone_by_repository(request,id):
    try:
        milestone= Milestone.objects.filter(repository=id)
        serializers = MilestoneSerializer(milestone,many=True)
        return Response(serializers.data)
    except Milestone.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def milestone_by_status_repository(request,status,repository):
    milestones = Milestone.objects.filter(Q(status=status) & Q(repository=repository))
    if(len(milestones) == 0): raise Http404('No milestone found that matches the given query.')
    serializers = MilestoneSerializer(milestones,many=True)
    return Response(serializers.data) 
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_milestone(request,id=None):
    try:
        milestones = Milestone.objects.all()
        serializers = MilestoneSerializer(milestones,many=True)
        return Response(serializers.data)
    except: 
        return Response(status=status.HTTP_404_NOT_FOUND)

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
def label_by_repository(request,id):
    label = Label.objects.filter(repository=id)
    serializers = LabelSerializer(label,many=True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issues_by_status_repository(request,status,repository):
    isuess = Issue.objects.filter(Q(status=status) & Q(repository=repository))
    if(len(isuess) == 0): raise Http404('No label found that matches the given query.')
    serializers = GetFullIssueSerializer(isuess,many=True)
    return Response(serializers.data)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_label(request,id=None):
    try:
        labels = Label.objects.all()
        serializers = LabelSerializer(labels,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

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
    try:
        issues = Issue.objects.all()
        serializers = IssueSerializer(issues,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issues_by_status(request,status):
    try:
        isuess = Issue.objects.filter(status=status)
        serializers = IssueSerializer(isuess,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issues_by_name(request,name):
    try:
        isuess = Issue.objects.filter(name=name)
        serializers = IssueSerializer(isuess,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issues_by_name_status(request,name,status):
    try:
        isuess = Issue.objects.filter(Q(status=status) & Q(title=name))
        serializers = IssueSerializer(isuess,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

      

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issues_by_author(request,author):
    try:
        isuess = Issue.objects.filter(author=author)
        serializers = IssueSerializer(isuess,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issues_by_label(request,label):
    try:
        isuess = Issue.objects.filter(labels=label)
        serializers = IssueSerializer(isuess,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issues_by_milestone(request,milestone):
    try:
        isuess = Issue.objects.filter(milestone=milestone)
        serializers = IssueSerializer(isuess,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def issues_by_assignee(request,assignee):
    try:
        isuess = Issue.objects.filter(assignees=assignee)
        serializers = IssueSerializer(isuess,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

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
        print(issue)
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
        serializers = GetFullPullRequestSerializer(pull_request)
        return Response(serializers.data)
    except PullRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_pull_request(request,id=None):
    try:
        pull_requests = PullRequest.objects.all()
        serializers = PullRequestSerializer(pull_requests,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pull_request_by_status(request,status,repository):
    try:
        pull_requests = PullRequest.objects.filter(Q(status=status) & Q(repository=repository))
        serializers = GetFullPullRequestSerializer(pull_requests,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pull_request_by_review(request,review):
    try:
        pull_requests = PullRequest.objects.filter(review=review)
        serializers = PullRequestSerializer(pull_requests,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pull_requests_by_author(request,author):
    try:
        pull_requests = PullRequest.objects.filter(author=author)
        serializers = PullRequestSerializer(pull_requests,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pull_requests_by_label(request,label):
    try:
        pull_requests = PullRequest.objects.filter(labels=label)
        serializers = PullRequestSerializer(pull_requests,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pull_requests_by_milestone(request,milestone):
    try:
        pull_requests = PullRequest.objects.filter(milestone=milestone)
        serializers = PullRequestSerializer(pull_requests,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pull_requests_by_assignee(request,assignee):
    try:
        pull_requests = PullRequest.objects.filter(assignees=assignee)
        serializers = PullRequestSerializer(pull_requests,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pull_requests_by_branch(request,branch):
    try:
        pull_requests = PullRequest.objects.filter(compare_branch=branch)
        serializers = PullRequestSerializer(pull_requests,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pull_requests_by_repository(request,repository):
    try:
        pull_requests = PullRequest.objects.filter(repository=repository)
        serializers = PullRequestSerializer(pull_requests,many=True)
        return Response(serializers.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

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


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_pull_request_status(request, id):
    try:
        pull_request = PullRequest.objects.get(id=id)
    except PullRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.data.get('review'):
        pull_request.review = request.data.get('review', pull_request.review)
    elif request.data.get('status'):
        pull_request.status = request.data.get('status', pull_request.status)

    pull_request.save()
    serializer = PullRequestSerializer(pull_request)
    return Response(serializer.data)
