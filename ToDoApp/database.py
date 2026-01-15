# SQLAlchemy is used to manage the database connection and ORM (Object Relational Mapping).  It allows developers to work with database logic using Python objects and classes, abstracting away the need to write raw SQL for most operations. 

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:poorvi26@localhost/ToDoApplicationDatabase' # Database connection URL

engine = create_engine(SQLALCHEMY_DATABASE_URL) # Create the database engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # Session factory

Base = declarative_base() # Base class for our ORM models

