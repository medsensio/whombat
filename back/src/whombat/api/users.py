"""Whombat Python API to interact with user objects in the database."""
import uuid
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from cachetools import LRUCache
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from whombat import cache, schemas
from whombat.api import common
from whombat.database import models
from whombat.filters import Filter

__all__ = [
    "create_user",
    "get_user_by_id",
    "get_user_by_email",
    "get_user_by_username",
    "get_users",
    "update_user",
    "delete_user",
]


@cache.cached(
    name="user_by_id",
    cache=LRUCache(maxsize=100),
    key=lambda _, user_id: user_id,
)
async def get_user_by_id(
    session: AsyncSession,
    user_id: uuid.UUID,
) -> schemas.User:
    """Get a user by id.

    Parameters
    ----------
    session : AsyncSession
        The database session to use.

    user_id : uuid.UUID
        The id to use.

    Returns
    -------
    user : schemas.User

    Raises
    ------
    whombat.exceptions.NotFoundError
    """
    obj = await common.get_object(
        session, models.User, models.User.id == user_id
    )
    return schemas.User.model_validate(obj)


@cache.cached(
    name="user_by_username",
    cache=LRUCache(maxsize=100),
    key=lambda _, username: username,
)
async def get_user_by_username(
    session: AsyncSession,
    username: str,
) -> schemas.User:
    """Get a user by username.

    Parameters
    ----------
    session : AsyncSession
        The database session to use.

    username : str
        The username to use.

    Returns
    -------
    user : schemas.User

    Raises
    ------
    whombat.exceptions.NotFoundError

    """
    obj = await common.get_object(
        session, models.User, models.User.username == username
    )
    return schemas.User.model_validate(obj)


@cache.cached(
    name="user_by_email",
    cache=LRUCache(maxsize=100),
    key=lambda _, email: email,
)
async def get_user_by_email(
    session: AsyncSession,
    email: str,
) -> schemas.User:
    """Get a user by email.

    Parameters
    ----------
    session : AsyncSession
        The database session to use.

    email : str
        The email to use.

    Returns
    -------
    user : schemas.User

    Raises
    ------
    whombat.exceptions.NotFoundError

    """
    obj = await common.get_object(
        session, models.User, models.User.email == email
    )
    return schemas.User.model_validate(obj)


async def get_users(
    session: AsyncSession,
    *,
    offset: int = 0,
    limit: int = 100,
    filters: list[Filter] | None = None,
    sort_by: str | None = "-created_at",
) -> list[schemas.User]:
    """Get all users.

    Parameters
    ----------
    session : AsyncSession
        The database session to use.

    offset : int, optional
        The number of users to skip, by default 0.

    limit : int, optional
        The number of users to get, by default 100.

    Returns
    -------
    users : List[schemas.User]

    """
    db_users = await common.get_objects(
        session,
        models.User,
        offset=offset,
        limit=limit,
        filters=filters,
        sort_by=sort_by,
    )
    return [schemas.User.model_validate(db_user) for db_user in db_users]


async def create_user(
    session: AsyncSession,
    data: schemas.UserCreate,
) -> schemas.User:
    """Create a user.

    This function creates a user in the database.

    Parameters
    ----------
    session : AsyncSession
        The database session to use.

    data : schemas.UserCreate
        The data to use for the user creation.

    Returns
    -------
    user : schemas.User

    Notes
    -----
    This function is asynchronous.

    Raises
    ------
    UserAlreadyExists
        If a user with the same username or email already exists.

    Examples
    --------
    To create a user:

    .. code-block:: python

        async with create_session() as session:
            user = await create_user(
                session,
                username="username",
                password="password",
                email="email",
            )

    """
    async with _get_user_manager_from_session(session) as user_manager:
        db_user = await user_manager.create(data)
        session.add(db_user)
        await session.commit()
        return schemas.User.model_validate(db_user)


async def update_user(
    session: AsyncSession,
    user_id: uuid.UUID,
    data: schemas.UserUpdate,
) -> schemas.User:
    """Update a user.

    Parameters
    ----------
    session : AsyncSession
        The database session to use.

    user_id : uuid.UUID
        The id of the user to update.

    data : schemas.UserUpdate
        The data to update the user with.

    Returns
    -------
    user : schemas.User

    Raises
    ------
    sqlalchemy.exc.NoResultFound
        If no user with the given id exists.

    """
    async with _get_user_manager_from_session(session) as user_manager:
        db_user = await user_manager.get(user_id)
        db_user = await user_manager.update(data, db_user)
        return schemas.User.model_validate(db_user)


async def delete_user(session: AsyncSession, user_id: uuid.UUID) -> None:
    """Delete a user.

    Parameters
    ----------
    session : AsyncSession
        The database session to use.

    user_id : uuid.UUID
        The id of the user to delete.

    """
    obj = await common.delete_object(
        session,
        models.User,
        models.User.id == user_id,
    )
    cache.clear_cache_key("user_by_id", obj.id)
    cache.clear_cache_key("user_by_username", obj.username)
    if obj.email is not None:
        cache.clear_cache_key("user_by_email", obj.email)


@asynccontextmanager
async def _get_user_db_context(
    session: AsyncSession,
) -> AsyncGenerator[SQLAlchemyUserDatabase, None]:
    """Get a SQLAlchemyUserDatabase context."""
    yield SQLAlchemyUserDatabase(session, models.User)  # type: ignore


@asynccontextmanager
async def _get_user_manager(
    user_database: SQLAlchemyUserDatabase,
) -> AsyncGenerator[models.UserManager, None]:
    """Get a UserManager context."""
    yield models.UserManager(user_database)


@asynccontextmanager
async def _get_user_manager_from_session(
    session: AsyncSession,
) -> AsyncGenerator[models.UserManager, None]:
    """Get a UserManager context from a database session."""
    async with _get_user_db_context(session) as user_db:
        async with _get_user_manager(user_db) as user_manager:
            yield user_manager
