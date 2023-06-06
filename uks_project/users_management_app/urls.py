from django.urls import path

from .views import CustomTokenObtainPairView, HelloView, UserRegistrationView, GetAllUsers, main

urlpatterns = [
    path('', main),
    path('hello', HelloView.as_view()),
    path('register', UserRegistrationView.as_view(), name='user-registration'),
    path('sign-in', CustomTokenObtainPairView.as_view(), name ='sign-in'),
     path('users', GetAllUsers.as_view(), name ='users')
]
