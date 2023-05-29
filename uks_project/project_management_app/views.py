from django.shortcuts import render
from .models import Milestone, Label
from django.http import Http404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import LabelSerializer, MilestoneSerializer
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
def get_label(request,id):
    try:
        label= Label.objects.get(id=id)
        serializers = LabelSerializer(label)
        return Response(serializers.data)
    except Label.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET'])
def get_all_label(request,id=None):
    labels = Label.objects.all()
    if(len(labels) == 0): raise Http404('No labels found that matches the given query.')
    serializers = LabelSerializer(labels,many=True)
    return Response(serializers.data)

@api_view(['POST'])
def add_new_label(request,id=None):
    serializer = LabelSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
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
def delete_label(request,id):
    try:
        label = Label.objects.get(id=id)
        label.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Label.DoesNotExist:
        label = None
        return Response(status=status.HTTP_404_NOT_FOUND)
