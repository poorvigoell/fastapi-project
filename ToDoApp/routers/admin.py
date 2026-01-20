from fastapi import HTTPException, Path
from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status
from models import ToDos, Users
from database import SessionLocal
from pydantic import BaseModel, Field
from routers.auth import get_current_user

router = APIRouter(
    prefix = '/admin',
    tags = ['admin']
)

def get_db():
    db = SessionLocal()
    try:
        yield db # Provide a database session
    finally:
        db.close() # Ensure the session is closed after use

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/todo", status_code=status.HTTP_200_OK)
async def read_all(user: user_dependency, db: db_dependency):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code=401, detail="Authentication failed.")
    
    todos = db.query(ToDos).all()
    return todos

@router.get("/todo/user/{user_id}", status_code=status.HTTP_200_OK)
async def read_todos_by_user(
    user: user_dependency,
    db: db_dependency,
    user_id: int = Path(gt=0)
):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code=401, detail="Authentication failed.")
    
    user_exists = db.query(Users).filter(Users.id == user_id).first()

    if not user_exists:
        raise HTTPException(status_code=404, detail="User not found")

    todos = db.query(ToDos).filter(ToDos.owner_id == user_id).all()
    return todos

@router.get("/users", status_code=status.HTTP_200_OK)
async def get_all_users(
    user: user_dependency,
    db: db_dependency
):
    if user is None or user.get("user_role") != "admin":
        raise HTTPException(status_code=401, detail="Authentication failed.")

    users = db.query(Users).filter(Users.is_active == True).all()
    return users

@router.delete("/todo/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(
    user: user_dependency,
    db: db_dependency,
    todo_id: int = Path(gt=0)):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code=401, detail="Authentication failed.")
    
    todo_model = db.query(ToDos).filter(ToDos.id == todo_id).first()
    if todo_model is None:
        raise HTTPException(status_code=404, detail="ToDo item not found.")

    db.query(ToDos).filter(ToDos.id == todo_id).delete()
    db.commit()