from django.urls import path
from . import views

urlpatterns = [
    path('repositories/', views.get_all_repositories, name='all_repositories'),
    path('repository/name/<str:name>', views.get_repo_by_name, name='repository_by_name'),
    path('repository/owner/<int:id>', views.get_repos_by_owner, name='repository_by_owner'),
    path('repository/<int:repo_id>/collaborators', views.get_repository_collaborators, name='repository_collaborators'),
    path('new-repository', views.add_new_repository, name='add_repository'),
    path('repository/<int:id>', views.delete_or_edit_repository, name='delete_or_edit_repository'),
    path('repository/id/<int:id>', views.get_repository_by_id, name='get_repository_by_id'),
    path('branches/', views.get_all_branches, name='get_all_branches'),
    path('branch/<str:name>', views.get_branch_by_name, name='branch_by_name'),
    path('branch/<int:id>/repository', views.get_repository_branches, name='repository_branches'),
    path('new-branch', views.add_new_branch, name='add_branch'),
    path('branch/<int:id>', views.delete_branch, name='delete_branch'),
    path('branch/<int:id>/edit', views.rename_branch, name='rename_branch'),
    path('commits/', views.get_all_commits, name='all_commits'),
    path('commit/<str:message>', views.get_commit_message, name='commit_message'),
    path('commit/<int:id>/branch', views.get_commit_branch, name='commit_branch'),
    path('add-new-commit', views.add_new_commit, name='add-new-commit'),
    path('commit/<int:id>/hash', views.get_commit_hash, name='commit_hash'),
    path('commits/author/<int:user_id>', views.get_all_commits_by_author, name='all_commits_by_author'),
    path('get-branch/<int:id>', views.get_branch_by_id, name='branch_by_id'),

]
