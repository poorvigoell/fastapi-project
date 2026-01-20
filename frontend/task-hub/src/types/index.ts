// User Model - matches backend exactly
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  role: "user" | "admin";
  phone_number: string;
}

// Todo Model - matches backend exactly
export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: 1 | 2 | 3 | 4 | 5;
  completed: boolean;
  owner_id: number;
}

// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  phone_number: string;
}

export interface PasswordUpdateData {
  current_password: string;
  new_password: string;
}

export interface PhoneUpdateData {
  phone_number: string;
}

// Form types for creating/updating todos
export interface TodoFormData {
  title: string;
  description: string;
  priority: 1 | 2 | 3 | 4 | 5;
}
