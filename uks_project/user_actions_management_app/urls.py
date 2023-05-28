from django.urls import path
from . import views

urlpatterns = [
    path('comments/', views.get_all_comments, name='all_comments'),
    path('pull_request/<int:pr_id>/comments', views.get_pr_comments, name='all_comments_on_pr'),
    path('issue/<int:issue_id>/comments', views.get_issue_comments, name='all_comments_on_issue'),
    path('comments/<int:id>', views.delete_or_edit_comment, name='delete_or_edit_comment'),
    path('new-comment', views.add_new_comment, name='add_comment'),
    path('reactions/', views.get_all_reactions, name='all_reactions'),
    path('comment/<int:comment_id>/reactions', views.get_comment_reactions, name='all_reactions_on_comment'),
    path('reactions/<int:id>', views.remove_reaction, name='remove_reaction_on_comment'),
    path('new-reaction', views.add_new_reaction, name='add_reaction')
]
