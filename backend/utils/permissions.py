from rest_framework import permissions


class IsOwnerOfObject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # allow GET, HEAD, or OPTION requests
        if request.method in permissions.SAFE_METHODS:
            return True
        # only allow editing/deletion for user owner
        return obj == request.user
