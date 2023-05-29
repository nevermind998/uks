from django.urls import path
from . import views

urlpatterns = [
    path('repositories/', views.get_all_repositories, name='all_repositories'),
    path('repository/name/<str:name>', views.get_repo_by_name, name='repository_by_name'),
    path('repository/owner/<int:id>', views.get_repos_by_owner, name='repository_by_owner'),
    path('repository/<int:id>/collaborators', views.get_repository_collaborators, name='repository_collaborators'),
    path('new-repository', views.add_new_repository, name='add_repository'),
    path('repository/<int:id>', views.delete_or_edit_repository, name='delete_or_edit_repository'),
    path('branches/', views.get_all_branches, name='get_all_branches'),
    path('branch/<str:name>', views.get_branch_by_name, name='branch_by_name'),
    path('branch/<int:id>/repository', views.get_repository_branches, name='repository_branches'),
    path('new-branch', views.add_new_branch, name='add_branch'),
    path('branch/<int:id>', views.delete_branch, name='delete_branch'),
    path('branch/<int:id>/edit', views.rename_branch, name='rename_branch'),

]
