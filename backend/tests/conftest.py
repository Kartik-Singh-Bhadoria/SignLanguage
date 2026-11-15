"""Pytest fixtures and environment initialization for SignConnect AI."""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.core.database import Base, SessionLocal, init_db, get_db
from backend.app.db_seeder import seed_isl_dictionary

# Initialize database schema and dictionary seeds for tests
init_db()
_db = SessionLocal()
try:
    seed_isl_dictionary(_db)
finally:
    _db.close()


@pytest.fixture(scope="session")
def engine():
    test_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=test_engine)
    yield test_engine
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def db_session(engine):
    connection = engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection, autocommit=False, autoflush=False)
    session = Session()

    yield session

    session.close()
    transaction.rollback()
    connection.close()
