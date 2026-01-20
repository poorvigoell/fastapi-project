import { User, Todo } from "@/types";

// Mock current user - can be switched to test admin/user views
export const mockCurrentUser: User = {
  id: 1,
  email: "john.doe@example.com",
  username: "johndoe",
  first_name: "John",
  last_name: "Doe",
  is_active: true,
  role: "admin", // Change to "user" to test user view
  phone_number: "+1 (555) 123-4567",
};

// Mock users for admin view
export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 2,
    email: "jane.smith@example.com",
    username: "janesmith",
    first_name: "Jane",
    last_name: "Smith",
    is_active: true,
    role: "user",
    phone_number: "+1 (555) 987-6543",
  },
  {
    id: 3,
    email: "bob.wilson@example.com",
    username: "bobwilson",
    first_name: "Bob",
    last_name: "Wilson",
    is_active: true,
    role: "user",
    phone_number: "+1 (555) 456-7890",
  },
];

// Mock todos
export const mockTodos: Todo[] = [
  {
    id: 1,
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the API endpoints and data models",
    priority: 5,
    completed: false,
    owner_id: 1,
  },
  {
    id: 2,
    title: "Review pull requests",
    description: "Review and merge pending pull requests from the team",
    priority: 4,
    completed: false,
    owner_id: 1,
  },
  {
    id: 3,
    title: "Update dependencies",
    description: "Update all npm packages to their latest stable versions",
    priority: 3,
    completed: true,
    owner_id: 1,
  },
  {
    id: 4,
    title: "Fix authentication bug",
    description: "Investigate and fix the token refresh issue reported by users",
    priority: 5,
    completed: false,
    owner_id: 2,
  },
  {
    id: 5,
    title: "Design new dashboard",
    description: "Create mockups for the updated analytics dashboard",
    priority: 2,
    completed: false,
    owner_id: 2,
  },
  {
    id: 6,
    title: "Write unit tests",
    description: "Add unit tests for the user service module",
    priority: 4,
    completed: true,
    owner_id: 3,
  },
  {
    id: 7,
    title: "Optimize database queries",
    description: "Analyze and optimize slow database queries",
    priority: 3,
    completed: false,
    owner_id: 3,
  },
];

// Helper to get user's todos
export const getUserTodos = (userId: number): Todo[] => {
  return mockTodos.filter((todo) => todo.owner_id === userId);
};

// Helper to get all todos (admin)
export const getAllTodos = (): Todo[] => {
  return mockTodos;
};

// Helper to get user by ID
export const getUserById = (userId: number): User | undefined => {
  return mockUsers.find((user) => user.id === userId);
};
