import { useState } from "react";
import { Todo } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoCardProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  showOwner?: boolean;
  ownerName?: string;
}

const priorityLabels: Record<number, string> = {
  1: "Lowest Priority",
  2: "Low Priority",
  3: "Medium Priority",
  4: "High Priority",
  5: "Urgent Priority",
};

const TodoCard = ({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
  showOwner = false,
  ownerName,
}: TodoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "todo-card animate-fade-in",
        todo.completed && "todo-card-completed"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggleComplete(todo.id)}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={cn(
                "text-sm font-medium truncate",
                todo.completed && "line-through text-muted-foreground"
              )}
            >
              {todo.title}
            </h3>
            <span className={`priority-badge priority-${todo.priority}`}>
              <Flag className="h-3 w-3 mr-1" />
              {priorityLabels[todo.priority]}
            </span>
          </div>
          <p
            className={cn(
              "text-sm text-muted-foreground line-clamp-2",
              todo.completed && "line-through"
            )}
          >
            {todo.description}
          </p>
          {showOwner && ownerName && (
            <p className="text-xs text-muted-foreground mt-2">
              Owner: <span className="font-medium">{ownerName}</span>
            </p>
          )}
        </div>
        <div
          className={cn(
            "transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0 md:opacity-0"
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onEdit(todo)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(todo.id)}
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
