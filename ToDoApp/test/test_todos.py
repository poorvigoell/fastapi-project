from ..routers.todos import get_db, get_current_user
from starlette import status
from ..models import ToDos
from .utils import *

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user


def test_read_all_authenticated(test_todo):
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == [{'completed': False, 'description': 'This is a test todo item', 'id': 1, 'owner_id': 1, 'priority': 1, 'title': 'Test ToDo'}]

def test_read_one_authenticated(test_todo):
    response = client.get("/todo/1")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {'completed': False, 
                               'description': 'This is a test todo item', 
                               'id': 1, 'owner_id': 1, 
                               'priority': 1, 'title': 'Test ToDo'}
    
def test_read_one_authenticated_not_found():
    response = client.get("/todo/999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "ToDo item not found"}

def test_create_todo(test_todo):
    request_data = {
        "title": "New ToDo",
        "description": "This is a new todo item",
        "priority": 2,
        "completed": False
    }
    response = client.post("/todo/", json=request_data)
    assert response.status_code == 201

    db = TestingSessionLocal()
    model = db.query(ToDos).filter(ToDos.id == 2).first()
    assert model.title == request_data.get('title')
    assert model.description == request_data.get('description')
    assert model.priority == request_data.get('priority')
    assert model.completed == request_data.get('completed')

def test_update_todo(test_todo):
    request_data = {
        "title": "Updated ToDo",
        "description": "This is an updated todo item",
        "priority": 3,
        "completed": True
    }
    response = client.put("/todo/1", json=request_data)
    assert response.status_code == 204

    db = TestingSessionLocal()
    model = db.query(ToDos).filter(ToDos.id == 1).first()
    assert model.title == "Updated ToDo"

def test_update_todo_not_found(test_todo):
    request_data = {
        "title": "Updated ToDo",
        "description": "This is an updated todo item",
        "priority": 3,
        "completed": True
    }
    response = client.put("/todo/999", json=request_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "ToDo item not found"}

def test_delete_todo(test_todo):
    response = client.delete("/todo/1")
    assert response.status_code == 204

    db = TestingSessionLocal()
    model = db.query(ToDos).filter(ToDos.id == 1).first()
    assert model is None

def test_delete_todo_not_found(test_todo):
    response = client.delete("/todo/999")
    assert response.status_code == 404
    assert response.json() == {"detail": "ToDo item not found"}