# TaskHub – Full Stack Task Management Application

TaskHub is a full-stack task management application built using **React (TypeScript)** and **FastAPI**.
It implements **JWT-based authentication**, **role-based access control**, and a clean separation between user and admin functionality.

---

## Features

### Authentication & Authorization

* JWT authentication
* Login and registration
* Session persistence on refresh
* Role-based access (`user`, `admin`)
* Protected routes on both frontend and backend

### User Functionality

* Create, update, and delete tasks
* Mark tasks as completed
* Search, filter, and sort tasks
* View profile information
* Update phone number
* Change password with current password verification

### Admin Functionality

* Admin-only dashboard
* View all users’ tasks
* Delete any task
* Read-only access except for delete operations
* Role enforcement via JWT claims

---

## Tech Stack

### Frontend

* React
* TypeScript
* React Router
* React Hook Form
* Zod
* Axios
* Tailwind CSS / shadcn-ui

### Backend

* FastAPI
* SQLAlchemy
* SQLite / PostgreSQL
* JWT (python-jose)
* bcrypt (passlib)
* OAuth2

---

## Architecture Overview

* Backend is the source of truth for authentication and authorization
* JWT tokens store user identity and role
* AuthContext manages frontend authentication state
* Shared UI components are reused across user and admin views
* No mock data in active production paths

---

## Admin User Handling

Admin users are automatically created at backend startup if they do not already exist.

* Admin credentials are provided via environment variables
* Passwords are hashed using bcrypt
* This ensures admin access is never lost if the database is reset
