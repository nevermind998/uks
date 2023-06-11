"""
URL configuration for uks_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/project/', include('project_management_app.urls'), name='project'),
    path('api/user-actions/', include('user_actions_management_app.urls'), name='useractions'),
    path('api/versioning/', include('versioning_management_app.urls'), name='versioning'),
    path('api/user/', include('users_management_app.urls'), name='users'),
]
