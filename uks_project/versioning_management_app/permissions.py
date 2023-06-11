from rest_framework.permissions import BasePermission

from users_management_app.models import User

from .models import Repository

class IsRepositoryCollaboratorOrOwner(BasePermission):
    def has_permission(self, request, view):
        repository_id = view.kwargs.get('repository')
        if not repository_id:
            repository_id = view.kwargs.get('id')

        repository = Repository.objects.get(id=repository_id)
        user = User.objects.get(email=request.user)
        if repository.visibility == 'PRIVATE':
            return (
                repository.owner == request.user or
                repository.collaborators.filter(id=user.id).exists()
            )

        return True
    
class IsRepositoryOwner(BasePermission):
    def has_permission(self, request, view):
        repository_id = view.kwargs.get('repository')
        if not repository_id:
            repository_id = view.kwargs.get('id')

        repository = Repository.objects.get(id=repository_id)
        return repository.owner == request.user
    
class IsRepositoryOwnerOrHasWriteAccess(BasePermission):
    def has_permission(self, request, view):
        repository_id = view.kwargs.get('repository')
        if not repository_id:
            repository_id = view.kwargs.get('id')

        repository = Repository.objects.get(id=repository_id)
        user = User.objects.get(email=request.user)

        if repository.visibility == 'PRIVATE':
            return (
                repository.owner == request.user or
                repository.collaborators.filter(id=user.id, role__in=['WRITE', 'ADMIN']).exists()
            )

        return True