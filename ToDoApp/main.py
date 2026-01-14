from fastapi import HTTPException, Path
from typing import Annotated
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from starlette import status
import models
from models import ToDos
from database import SessionLocal, engine
from pydantic import BaseModel, Field

from routers import auth

app = FastAPI()

models.Base.metadata.create_all(bind=engine)  # Create the database tables

app.include_router(auth.router)

def get_db():
    db = SessionLocal()
    try:
        yield db # Provide a database session
    finally:
        db.close() # Ensure the session is closed after use

db_dependency = Annotated[Session, Depends(get_db)]

class ToDoRequest(BaseModel):
    title: str = Field(min_length=3)
    description: str = Field(min_length=3, max_length=100)
    priority: int = Field(gt=0, lt=6)
    completed: bool


@app.get("/", status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency): # Endpoint to read all ToDo items
    todos = db.query(ToDos).all()
    return todos

@app.get("/todo/{todo_id}", status_code=status.HTTP_200_OK)
async def read_todo(db: db_dependency, todo_id: int = Path(gt=0)):
    todo_model = db.query(ToDos).filter(ToDos.id == todo_id).first()
    if todo_model is not None:
        return todo_model
    raise HTTPException(status_code=404, detail="ToDo item not found")

@app.post("/todo", status_code=status.HTTP_201_CREATED)
async def create_todo(db: db_dependency, todo_request: ToDoRequest):
    todo_model = ToDos(**todo_request.dict())
    db.add(todo_model)
    db.commit()

@app.put("/todo/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_todo(db: db_dependency, 
                      todo_request: ToDoRequest, 
                      todo_id: int = Path(gt=0)):
    todo_model = db.query(ToDos).filter(ToDos.id == todo_id).first()
    if todo_model is None:
        raise HTTPException(status_code=404, detail="ToDo item not found")
    
    todo_model.title = todo_request.title
    todo_model.description = todo_request.description
    todo_model.priority = todo_request.priority
    todo_model.completed = todo_request.completed
    db.add(todo_model)
    db.commit()

@app.delete("/todo/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(db: db_dependency, todo_id: int = Path(gt=0)):
    todo_model = db.query(ToDos).filter(ToDos.id == todo_id).first()
    if todo_model is None:
        raise HTTPException(status_code=404, detail="ToDo item not found")
    
    db.query(ToDos).filter(ToDos.id == todo_id).delete()
    db.commit()