from django.urls import path

from .views import CustomTokenObtainPairView, UserRegistrationView, main
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('', main),
    path('register', UserRegistrationView.as_view(), name='user-registration'),
    path('sign-in', CustomTokenObtainPairView.as_view(), name ='sign-in')
]
