import { Todo } from "@/types";
import TodoCard from "./TodoCard";
import { getUserById } from "@/data/mockData";

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  showOwner?: boolean;
  emptyMessage?: string;
}

const TodoList = ({
  todos,
  onToggleComplete,
  onEdit,
  onDelete,
  showOwner = false,
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
      {todos.map((todo) => {
        const owner = showOwner ? getUserById(todo.owner_id) : undefined;
        return (
          <TodoCard
            key={todo.id}
            todo={todo}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            showOwner={showOwner}
            ownerName={owner ? `${owner.first_name} ${owner.last_name}` : undefined}
          />
        );
      })}
    </div>
  );
};

export default TodoList;
