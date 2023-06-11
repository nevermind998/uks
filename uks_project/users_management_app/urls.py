from django.urls import path

from .views import CustomTokenObtainPairView, HelloView, UserRegistrationView, GetAllUsers, main
from . import views

urlpatterns = [
    path('', main),
    path('hello', HelloView.as_view()),
    path('register', UserRegistrationView.as_view(), name='user-registration'),
    path('sign-in', CustomTokenObtainPairView.as_view(), name ='sign-in'),
    path('get-user/<int:id>', views.get_user_by_id, name='user-id'),
    path('get-assignees/<int:id>', views.get_pr_assignees, name='assignees'),
    path('users', views.get_all_users, name='get_all'),
    path('edit', views.edit_user, name='edit_user'),

]
