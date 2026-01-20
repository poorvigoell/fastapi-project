import os
from sqlalchemy.orm import Session
from .models import Users
from passlib.context import CryptContext

# Use the SAME bcrypt config as auth.py
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_admin_if_not_exists(db: Session):
    admin_username = os.getenv("ADMIN_USERNAME")
    admin_password = os.getenv("ADMIN_PASSWORD")
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_first_name = os.getenv("ADMIN_FIRST_NAME")
    admin_last_name = os.getenv("ADMIN_LAST_NAME")
    admin_phone = os.getenv("ADMIN_PHONE")

    # Safety check
    if not admin_username or not admin_password or not admin_email:
        return

    # Check if admin already exists
    admin = db.query(Users).filter(Users.username == admin_username).first()
    if admin:
        return  # Admin already exists

    # Create admin with bcrypt-hashed password
    admin_user = Users(
        username=admin_username,
        email=admin_email,
        first_name=admin_first_name,
        last_name=admin_last_name,
        hashed_password=bcrypt_context.hash(admin_password),
        role="admin",
        is_active=True,
        phone_number=admin_phone,
    )

    db.add(admin_user)
    db.commit()
