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
    path('new-reaction', views.add_new_reaction, name='add_reaction'),
    path('repository/<int:repo_id>/stargazers', views.get_repo_stargazers, name='get_repo_stargazers'),
    path('repository/<int:repo_id>/watchers', views.get_repo_watchers, name='get_repo_watchers'),
    path('repository/<int:repo_id>/forked-repos', views.get_repo_forks, name='get_repo_forks'),
    path('user-profile/<int:user_id>/stars', views.get_users_stars, name='get_users_stars'),
    path('repository/<int:repo_id>/user/<int:user_id>/<str:action_type>', views.get_action_for_user, name='get_action_for_user'),
    path('new-action', views.add_new_action, name='add_action'),
    path('actions/<int:id>', views.remove_action, name='remove_action_on_repository')
]
