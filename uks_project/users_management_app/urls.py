from django.urls import path

from .views import UserRegistrationView, main
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('', main),
    path('register', UserRegistrationView.as_view(), name='user-registration'),
    path('sign-in', jwt_views.TokenObtainPairView.as_view(), name ='sign-in')
]
