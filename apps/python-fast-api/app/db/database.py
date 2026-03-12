import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import AsyncAdaptedQueuePool
from app.utils.logger import setup_logger
from app.config import get_settings
from urllib.parse import quote_plus

settings = get_settings()
logger = setup_logger(__name__)


def get_database_url() -> str:

    if settings.ENVIRONMENT == "testing" and settings.TEST_DATABASE_URL:
        return settings.TEST_DATABASE_URL

    if settings.DB_NAME:
        password = quote_plus(settings.DB_PASSWORD) if settings.DB_PASSWORD else ""

        return (
            f"postgresql+asyncpg://{settings.DB_USER}:{password}"
            f"@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
        )

    raise ValueError("No database configuration found")


def create_engine_with_retry(database_url: str):
    """
    Creates an async engine with retry logic and appropriate configuration
    based on the database type.
    """
    # connect_args = {}
    connect_args = {"ssl": True}
    pooling_args = {
        "pool_pre_ping": True,
        "pool_recycle": 3600,
        "echo": False,
    }

    if database_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
    else:
        pooling_args.update(
            {
                "poolclass": AsyncAdaptedQueuePool,
                "pool_size": 5,
                "max_overflow": 5,
                "pool_timeout": 30,
            }
        )
    return create_async_engine(database_url, connect_args=connect_args, **pooling_args)


# Create the engine
engine = create_engine_with_retry(get_database_url())

# Create async session maker
AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False, autocommit=False, autoflush=False
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    """
    Dependency that provides a database session.
    """

    session = AsyncSessionLocal()
    logger.debug("Creating new database session")

    try:
        yield session

    except Exception as e:
        logger.error(f"Database session error: {str(e)}")
        await session.rollback()
        raise

    finally:
        logger.debug("Closing database session")
        await session.close()


async def init_db() -> None:
    """
    Initialize database tables and perform startup operations.
    """

    logger.info("Initializing database")

    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        logger.info("Database initialized successfully")

    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise
