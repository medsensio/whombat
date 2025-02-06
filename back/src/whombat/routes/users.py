"""Module containing the router for the Auth."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from whombat import api, schemas

from whombat.filters.users import UserFilter
from whombat.routes.dependencies.auth import get_users_api
from whombat.routes.dependencies.settings import WhombatSettings
from whombat.routes.dependencies.users import UserManager, get_user_manager
from whombat.schemas.users import User, UserCreate, UserUpdate, SimpleUser
from whombat.routes.dependencies import Session
from whombat.routes.types import Limit, Offset
from uuid import UUID
from whombat import models

__all__ = [
    "get_users_router",
]


def get_users_router(settings: WhombatSettings) -> APIRouter:
    users_router = APIRouter()

    fastapi_users = get_users_api(settings)

    users_router.include_router(
        fastapi_users.get_users_router(User, UserUpdate)
    )

    @users_router.get(
        "/detail/",
        response_model=schemas.User,
    )
    async def get_user(
        session: Session,
        user_id: UUID,
    ):
        """Get a user by id."""
        return await api.users.get(session, user_id)
    
    @users_router.get(
        "/",
        response_model=schemas.Page[schemas.User],
    )
    async def get_users(
        session: Session,
        filter: Annotated[
            UserFilter,  # type: ignore
            Depends(UserFilter),
        ],
        limit: Limit = 10,
        offset: Offset = 0,
    ):
        """Get a page of datasets."""    

        users, total = await api.users.get_many(
            session,
            limit=limit,
            offset=offset,
            filters=[filter, models.User.is_superuser == False],
        )

        return schemas.Page(
            items=users,
            total=total,
            offset=offset,
            limit=limit,
        ) 

    @users_router.post(
        "/",
        response_model=schemas.User,
    )
    async def create_user(
        session: Session,
        user: schemas.UserCreate,
    ): 
        """Create a new user."""
        created = await api.users.create(
            session,
            username=user.username,
            name=user.name,
            password=user.password,
            email=user.email,
        )
        await session.commit()
        return created   

    @users_router.delete(
        "/delete/",
        response_model=schemas.User,
    )
    async def delete_user(
        session: Session,
        user_id: UUID,
    ):
        """Delete a user."""
        print(f"user_id => {user_id}\n")
        user = await api.users.get(session, user_id)
        print(f"user => {user}\n")
        deleted = await api.users.delete(session, user)
        await session.commit()
        return deleted

    @users_router.post("/first/", response_model=User)
    async def create_first_user(
        data: UserCreate,
        user_manager: Annotated[UserManager, Depends(get_user_manager)],
    ):
        """Create the first user."""
        if await user_manager.user_db.has_user():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="A first user has already been created.",
            )

        # This is the first user, so make them an admin
        data.is_superuser = True

        return await user_manager.create(data, safe=True)

    return users_router
