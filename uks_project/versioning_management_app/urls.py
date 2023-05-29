from django.urls import path
from . import views

urlpatterns = [
    path('repository/', views.get_all_repositories, name='all_repositories'),
    path('repository/name/<str:name>', views.get_repo_by_name, name='repository_by_name'),
    path('repository/owner/<int:id>', views.get_repos_by_owner, name='repository_by_owner'),
    path('repository/<int:id>/collaborators', views.get_repository_collaborators, name='repository_collaborators'),
    path('new-repository', views.add_new_repository, name='add_repository'),
    path('repository/<int:id>', views.delete_or_edit_repository, name='delete_or_edit_repository'),

]
