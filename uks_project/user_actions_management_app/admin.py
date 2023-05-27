from django.contrib import admin

from .models import Comment, Action, Reaction

# Register your models here.

admin.site.register(Comment)
admin.site.register(Action)
admin.site.register(Reaction)
