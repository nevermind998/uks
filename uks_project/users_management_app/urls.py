from django.urls import path

from .views import CustomTokenObtainPairView, HelloView, UserRegistrationView, main
from . import views

urlpatterns = [
    path('', main),
    path('hello', HelloView.as_view()),
    path('register', UserRegistrationView.as_view(), name='user-registration'),
    path('sign-in', CustomTokenObtainPairView.as_view(), name ='sign-in'),
    path('get-user/<int:id>', views.get_user_by_id, name='user-id'),

]
