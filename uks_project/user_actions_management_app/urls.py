from django.urls import path
from . import views

urlpatterns = [
    path('comments/', views.get_all_comments, name='all_comments'),
    path('pull_request/<int:pr_id>/comments', views.get_pr_comments, name='all_comments_on_pr'),
    path('issue/<int:issue_id>/comments', views.get_issue_comments, name='all_comments_on_issue'),
    path('comments/<int:id>', views.delete_comment_by_id, name='delete_comment'),
    path('comments/<int:id>', views.edit_comment_by_id, name='edit_comment'),
    path('comments/add', views.add_new_comment, name='add_comment'),
]
