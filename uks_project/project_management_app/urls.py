from django.urls import path
from . import views

urlpatterns = [
    path('milestone/<int:id>', views.get_milestone, name='milestone'),
    path('milestones/', views.get_all_milestone, name='milestones'),
    path('new-milestone', views.add_new_milestone, name='new-milestone'),
    path('update_milestone/<int:id>', views.update_milestone, name='update_milestone'),
    path('delete_milestone/<int:id>', views.delete_milestone, name='delete_milestone')
]
