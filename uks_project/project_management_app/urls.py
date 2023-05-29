from django.urls import path
from . import views

urlpatterns = [
    #milestone
    path('milestone/<int:id>', views.get_milestone, name='milestone'),
    path('milestones/', views.get_all_milestone, name='milestones'),
    path('new-milestone', views.add_new_milestone, name='new-milestone'),
    path('update_milestone/<int:id>', views.update_milestone, name='update_milestone'),
    path('delete_milestone/<int:id>', views.delete_milestone, name='delete_milestone'),

    #label
    path('label/<int:id>', views.get_label, name='label'),
    path('labels/', views.get_all_label, name='labels'),
    path('new-label', views.add_new_label, name='new-label'),
    path('update_label/<int:id>', views.update_label, name='update_label'),
    path('delete_label/<int:id>', views.delete_label, name='delete_label'),

    #issue
    path('issue/<int:id>', views.get_issue, name='issue'),
    path('issues/', views.get_all_issue, name='issues'),
    path('new-issue', views.add_new_issue, name='new-issue'),
    path('update_issue/<int:id>', views.update_issue, name='update_issue'),
    path('delete_issue/<int:id>', views.delete_issue, name='delete_issue'),

    #pull request
    path('pull_request/<int:id>', views.get_pull_request, name='pull_request'),
    path('pull_requests/', views.get_all_pull_request, name='pull_requests'),
    path('new-pull_request', views.add_new_pull_request, name='new-pull_request'),
    path('update_pull_request/<int:id>', views.update_pull_request, name='update_pull_request'),
    path('delete_pull_request/<int:id>', views.delete_pull_request, name='delete_pull_request'),
]
