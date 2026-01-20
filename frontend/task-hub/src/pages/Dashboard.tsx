import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Todo, TodoFormData } from "@/types";
// import { getUserTodos } from "@/data/mockData";
import api from "@/lib/api";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import TodoList from "@/components/todos/TodoList";
import TodoForm from "@/components/todos/TodoForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, CheckCircle2, Circle, ListTodo } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");
  const [sortBy, setSortBy] = useState<"priority" | "title">("priority");

  useEffect(() => {
    if (!user?.id) return;

    const fetchTodos = async () => {
      try {
        const res = await api.get("/todos");
        setTodos(res.data);
      } catch (err) {
        console.error("Failed to fetch todos", err);
      }
    };

    fetchTodos();
  }, [user?.id]);

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

    // Filter by status
    if (filterStatus === "completed") {
      result = result.filter((todo) => todo.completed);
    } else if (filterStatus === "pending") {
      result = result.filter((todo) => !todo.completed);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "priority") {
        return b.priority - a.priority;
      }
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [todos, searchQuery, filterStatus, sortBy]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [todos]);

  const handleToggleComplete = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      await api.put(`/todos/todo/${id}`, {
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        completed: !todo.completed,
      });

      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      console.error("Failed to update todo", err);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/todos/todo/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Failed to delete todo", err);
    }
  };

  const handleSubmit = async (data: TodoFormData) => {
    try {
      if (editingTodo) {
        await api.put(`/todos/todo/${editingTodo.id}`, {
          ...data,
          completed: editingTodo.completed,
        });

        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === editingTodo.id ? { ...todo, ...data } : todo
          )
        );
      } else {
        const res = await api.post("/todos/todo", {
          ...data,
          completed: false,
        });

        // backend doesn’t return todo, so refetch
        const refreshed = await api.get("/todos");
        setTodos(refreshed.data);
      }

      setEditingTodo(null);
      setIsFormOpen(false);
    } catch (err) {
      console.error("Failed to save todo", err);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  return (
    <div className="page-container">
      <Navbar />
      <main className="content-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Tasks</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.first_name}. Here's what you need to do.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ListTodo className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Circle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
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
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Todo List */}
        <TodoList
          todos={filteredTodos}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No tasks found. Create your first task to get started!"
        />

        {/* Todo Form Modal */}
        <TodoForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editingTodo}
        />
      </main>
    </div>
  );
};

export default Dashboard;
