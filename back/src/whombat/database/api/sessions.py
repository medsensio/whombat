"""Python API to manage database sessions."""
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import async_sessionmaker  # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from whombat.database import models
from whombat.database import utils

__all__ = [
    "create",
]


DEFAULT_DB_URL = "sqlite+aiosqlite://"
"""Default database URL to use if none is provided."""


@asynccontextmanager
async def create(
    db_url: str = DEFAULT_DB_URL,
) -> AsyncGenerator[AsyncSession, None]:
    """Create a database session.

    This function creates a database session that can be used to interact with
    the database.

    It is a context manager, so it can be used with the ``async with`` syntax.

    Parameters
    ----------
    db_url : str, optional
        The database URL to use, by default it is set to
        ``sqlite+aiosqlite://``, which is an in-memory database.


    Yields
    ------
    session: AsyncSession
        The database session.

    Examples
    --------
    To create a database session, use the ``async with`` syntax.

    .. code-block:: python

        async with create_session() as session:
            # Do stuff with the session
            # ...

    You can specify a database URL to use.

    .. code-block:: python

        async with create_session("sqlite+aiosqlite:///my_db.db") as session:
            # Do stuff with the session
            # ...

    Note
    ----
    This function is asynchronous, so it must be called with the ``await``
    keyword.

    """
    engine = utils.create_db_engine(db_url)
    await utils.create_db_and_tables(engine)
    async with utils.get_async_session(engine) as session:
        yield session
