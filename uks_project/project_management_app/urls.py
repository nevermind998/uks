from django.urls import path
from . import views

urlpatterns = [
    #milestone
    path('milestone/<int:id>', views.get_milestone, name='milestone'),
    path('milestone/<int:id>/repository', views.get_milestone_by_repository, name='milestone_by_repository'),
    path('milestones/', views.get_all_milestone, name='milestones'),
    path('new-milestone', views.add_new_milestone, name='new-milestone'),
    path('update-milestone/<int:id>', views.update_milestone, name='update-milestone'),
    path('delete-milestone/<int:id>', views.delete_milestone, name='delete-milestone'),

    #label
    path('label/<int:id>', views.get_label, name='label'),
    path('label/<str:color>/color', views.label_by_color, name='label_by_color'),
    path('label/<int:id>/repository', views.label_by_repository, name='label_by_repository'),
    path('labels/', views.get_all_label, name='labels'),
    path('new-label', views.add_new_label, name='new-label'),
    path('update-label/<int:id>', views.update_label, name='update-label'),
    path('delete-label/<int:id>', views.delete_label, name='delete-label'),

    #issue
    path('issue/<int:id>', views.get_issue, name='issue'),
    path('issues/', views.get_all_issue, name='issues'),
    path('issues/<str:status>/status', views.issues_by_status, name='issues_by_status'),
    path('issues/<int:author>/author', views.issues_by_author, name='issues_by_author'),
    path('issues/<int:label>/label', views.issues_by_label, name='issues_by_label'),
    path('issues/<int:milestone>/milestone', views.issues_by_milestone, name='issues_by_milestone'),
    path('issues/<int:assignee>/assignee', views.issues_by_assignee, name='issues_by_assignee'),
    path('new-issue', views.add_new_issue, name='new-issue'),
    path('update-issue/<int:id>', views.update_issue, name='update-issue'),
    path('delete-issue/<int:id>', views.delete_issue, name='delete-issue'),

    #pull request
    path('pull_request/<int:id>', views.get_pull_request, name='pull_request'),
    path('pull_requests/', views.get_all_pull_request, name='pull_requests'),
    path('pull_requests/<str:status>/repository/<int:repository>', views.get_pull_request_by_status, name='pull_requests_by_status'),    
    path('pull_requests/<str:review>/review', views.get_pull_request_by_review, name='pull_requests_by_review'),
    path('pull_requests/<int:author>/author', views.pull_requests_by_author, name='pull_requests_by_author'),
    path('pull_requests/<int:label>/label', views.pull_requests_by_label, name='pull_requests_by_label'),
    path('pull_requests/<int:milestone>/milestone', views.pull_requests_by_milestone, name='pull_requests_by_milestone'),
    path('pull_requests/<int:assignee>/assignee', views.pull_requests_by_assignee, name='pull_requests_by_assignee'),
    path('pull_requests/<int:branch>/branch', views.pull_requests_by_branch, name='pull_requests_by_branch'),
    path('pull_requests/<int:repository>/repository', views.pull_requests_by_repository, name='pull_requests_by_repository'),
    path('new-pull_request', views.add_new_pull_request, name='new-pull_request'),
    path('update-pull_request/<int:id>', views.update_pull_request, name='update-pull_request'),
    path('delete-pull_request/<int:id>', views.delete_pull_request, name='delete-pull_request'),
    path('change-pr-status/<int:id>', views.change_pull_request_status, name='change-pull-request-status'),

]
