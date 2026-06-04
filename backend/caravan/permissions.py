"""Shared RBAC permission classes."""
from rest_framework.permissions import BasePermission

from accounts.choices import UserRole


class IsAdmin(BasePermission):
    """Only platform administrators."""

    def has_permission(self, request, view) -> bool:
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.ADMIN
        )


class IsProductManager(BasePermission):
    """Product managers and admins."""

    def has_permission(self, request, view) -> bool:
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in (UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
        )


class IsCustomer(BasePermission):
    """Store customers."""

    def has_permission(self, request, view) -> bool:
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.CUSTOMER
        )


class IsAdminOrReadOnly(BasePermission):
    """Read for authenticated; write for admin/product manager."""

    def has_permission(self, request, view) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return request.user.role in (UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
