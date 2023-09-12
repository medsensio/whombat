"""Python API for annotation projects."""

from typing import Sequence
from uuid import UUID

from cachetools import LRUCache
from sqlalchemy.ext.asyncio import AsyncSession

from whombat import cache, models, schemas
from whombat.api import common
from whombat.filters.base import Filter

__all__ = [
    "add_tag",
    "create",
    "delete",
    "get_by_id",
    "get_by_name",
    "get_by_uuid",
    "get_many",
    "remove_tag",
    "update",
]


caches = cache.CacheCollection(schemas.AnnotationProject)


@caches.cached(
    name="annotation_project_by_id",
    cache=LRUCache(maxsize=1000),
    key=lambda _, annotation_project_id: annotation_project_id,
    data_key=lambda annotation_project: annotation_project.id,
)
async def get_by_id(
    session: AsyncSession, annotation_project_id: int
) -> schemas.AnnotationProject:
    """Get an annotation project by its ID."""
    annotation_project = await common.get_object(
        session,
        models.AnnotationProject,
        models.AnnotationProject.id == annotation_project_id,
    )
    return schemas.AnnotationProject.model_validate(annotation_project)


@caches.cached(
    name="annotation_project_by_uuid",
    cache=LRUCache(maxsize=1000),
    key=lambda _, annotation_project_uuid: annotation_project_uuid,
    data_key=lambda annotation_project: annotation_project.uuid,
)
async def get_by_uuid(
    session: AsyncSession, annotation_project_uuid: UUID
) -> schemas.AnnotationProject:
    """Get an annotation project by its UUID."""
    annotation_project = await common.get_object(
        session,
        models.AnnotationProject,
        models.AnnotationProject.uuid == annotation_project_uuid,
    )
    return schemas.AnnotationProject.model_validate(annotation_project)


@caches.cached(
    name="annotation_project_by_name",
    cache=LRUCache(maxsize=1000),
    key=lambda _, annotation_project_name: annotation_project_name,
    data_key=lambda annotation_project: annotation_project.name,
)
async def get_by_name(
    session: AsyncSession, annotation_project_name: str
) -> schemas.AnnotationProject:
    """Get an annotation project by its name."""
    annotation_project = await common.get_object(
        session,
        models.AnnotationProject,
        models.AnnotationProject.name == annotation_project_name,
    )
    return schemas.AnnotationProject.model_validate(annotation_project)


async def get_many(
    session: AsyncSession,
    *,
    limit: int = 1000,
    offset: int = 0,
    filters: Sequence[Filter] | None = None,
    sort_by: str | None = "-created_at",
) -> tuple[list[schemas.AnnotationProject], int]:
    """Get all annotation projects."""
    annotation_projects, count = await common.get_objects(
        session,
        models.AnnotationProject,
        limit=limit,
        offset=offset,
        filters=filters,
        sort_by=sort_by,
    )
    return [
        schemas.AnnotationProject.model_validate(ap)
        for ap in annotation_projects
    ], count


@caches.with_update
async def create(
    session: AsyncSession, data: schemas.AnnotationProjectCreate
) -> schemas.AnnotationProject:
    """Create an annotation project."""
    annotation_project = await common.create_object(
        session,
        models.AnnotationProject,
        data,
    )
    return schemas.AnnotationProject.model_validate(annotation_project)


@caches.with_update
async def update(
    session: AsyncSession,
    annotation_project_id: int,
    data: schemas.AnnotationProjectUpdate,
) -> schemas.AnnotationProject:
    """Update an annotation project."""
    annotation_project = await common.update_object(
        session,
        models.AnnotationProject,
        models.AnnotationProject.id == annotation_project_id,
        data,
    )
    return schemas.AnnotationProject.model_validate(annotation_project)


@caches.with_clear
async def delete(
    session: AsyncSession,
    annotation_project_id: int,
) -> schemas.AnnotationProject:
    """Delete an annotation project."""
    annotation_project = await common.delete_object(
        session,
        models.AnnotationProject,
        models.AnnotationProject.id == annotation_project_id,
    )
    return schemas.AnnotationProject.model_validate(annotation_project)


@caches.with_update
async def add_tag(
    session: AsyncSession,
    annotation_project_id: int,
    tag_id: int,
) -> schemas.AnnotationProject:
    """Add a tag to an annotation project."""
    annotation_project = await common.add_tag_to_object(
        session,
        models.AnnotationProject,
        models.AnnotationProject.id == annotation_project_id,
        tag_id,
    )
    return schemas.AnnotationProject.model_validate(annotation_project)


@caches.with_update
async def remove_tag(
    session: AsyncSession,
    annotation_project_id: int,
    tag_id: int,
) -> schemas.AnnotationProject:
    """Remove a tag from an annotation project."""
    annotation_project = await common.remove_tag_from_object(
        session,
        models.AnnotationProject,
        models.AnnotationProject.id == annotation_project_id,
        tag_id,
    )
    return schemas.AnnotationProject.model_validate(annotation_project)