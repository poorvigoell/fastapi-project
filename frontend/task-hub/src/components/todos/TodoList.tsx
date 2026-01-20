import { Todo } from "@/types";
import TodoCard from "./TodoCard";

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  showOwner?: boolean;
  readOnly?: boolean;
  emptyMessage?: string;
}

const TodoList = ({
  todos,
  onToggleComplete,
  onEdit,
  onDelete,
  showOwner = false,
  readOnly = false,
  emptyMessage = "No todos found",
}: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          showOwner={showOwner}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
};

export default TodoList;
