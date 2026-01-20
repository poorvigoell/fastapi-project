from dotenv import load_dotenv
load_dotenv()
from seed_admin import create_admin_if_not_exists
from fastapi import FastAPI
from models import Base
from database import engine, SessionLocal
from routers import auth, todos, admin, users
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # React port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        create_admin_if_not_exists(db)
    finally:
        db.close()
        
@app.get("/healthy")
def health_check():
    return {"status": "Healthy"}

app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(admin.router)
app.include_router(users.router)