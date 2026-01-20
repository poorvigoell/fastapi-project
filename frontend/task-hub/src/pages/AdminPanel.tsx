import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Todo } from "@/types";
import { getAllTodos, mockUsers } from "@/data/mockData";
import Navbar from "@/components/layout/Navbar";
import TodoList from "@/components/todos/TodoList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Users, ListTodo, Shield } from "lucide-react";
import { Navigate } from "react-router-dom";

const AdminPanel = () => {
  const { isAdmin, user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>(getAllTodos);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOwner, setFilterOwner] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          todo.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by owner
    if (filterOwner !== "all") {
      result = result.filter((todo) => todo.owner_id === Number(filterOwner));
    }

    // Filter by status
    if (filterStatus === "completed") {
      result = result.filter((todo) => todo.completed);
    } else if (filterStatus === "pending") {
      result = result.filter((todo) => !todo.completed);
    }

    // Sort by priority (highest first)
    result.sort((a, b) => b.priority - a.priority);

    return result;
  }, [todos, searchQuery, filterOwner, filterStatus]);

  const stats = useMemo(() => {
    return {
      totalTodos: todos.length,
      totalUsers: mockUsers.length,
      completedTodos: todos.filter((t) => t.completed).length,
    };
  }, [todos]);

  const handleToggleComplete = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleEdit = (todo: Todo) => {
    // Admin can view but editing would require the todo form
    console.log("View todo:", todo);
  };

  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="page-container">
      <Navbar />
      <main className="content-container">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-admin" />
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground">
            Manage all tasks across the platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-admin/10">
                <Users className="h-5 w-5 text-admin" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ListTodo className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalTodos}</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <ListTodo className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completedTodos}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterOwner} onValueChange={setFilterOwner}>
              <SelectTrigger className="w-[150px]">
                <Users className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {mockUsers.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.first_name} {u.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Todo List */}
        <TodoList
          todos={filteredTodos}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showOwner={true}
          emptyMessage="No tasks found matching your filters."
        />
      </main>
    </div>
  );
};

export default AdminPanel;
