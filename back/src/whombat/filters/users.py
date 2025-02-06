"""Filters for Datasets."""

from whombat import models
from whombat.filters import base

__all__ = [
    "CreatedOnFilter",
    "UserFilter",
    "SearchFilter",
]


SearchFilter = base.search_filter(
    [
        models.User.username,
        models.User.email,
        models.User.name,
    ]
)


CreatedOnFilter = base.date_filter(
    models.User.created_on,
)

SuperuserFilter = base.boolean_filter(models.User.is_superuser)


UserFilter = base.combine(
    SearchFilter,
    created_on=CreatedOnFilter,
    is_superuser=SuperuserFilter,
)
