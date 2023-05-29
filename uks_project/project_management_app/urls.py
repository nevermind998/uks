from django.urls import path
from . import views

urlpatterns = [
    #milestone
    path('milestone/<int:id>', views.get_milestone, name='milestone'),
    path('milestones/', views.get_all_milestone, name='milestones'),
    path('new-milestone', views.add_new_milestone, name='new-milestone'),
    path('update_milestone/<int:id>', views.update_milestone, name='update_milestone'),
    path('delete_milestone/<int:id>', views.delete_milestone, name='delete_milestone'),

    #label
    path('label/<int:id>', views.get_label, name='label'),
    path('labels/', views.get_all_label, name='labels'),
    path('new-label', views.add_new_label, name='new-label'),
    path('update_label/<int:id>', views.update_label, name='update_label'),
    path('delete_label/<int:id>', views.delete_label, name='delete_label')
]
