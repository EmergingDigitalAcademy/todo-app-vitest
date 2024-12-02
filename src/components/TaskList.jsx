import { useEffect } from "react";
import useTodoStore from "../stores/todoStore";
import useAuthStore from "../stores/authStore";
import { Table, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { BsCheckSquare, BsSquare } from "react-icons/bs";

function TaskList() {
  const {
    todos,
    isLoading,
    error,
    fetchTodos,
    deleteTodo,
    completeTodo,
    incompleteTodo,
  } = useTodoStore();
  
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [fetchTodos, user]);

  // Don't render if not authenticated
  if (!user) return null;

  if (isLoading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  const getBadgeVariant = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <Table bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>Due Date</th>
            <th>Title</th>
            <th>Priority</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr
              key={todo.id}
              className={todo.completed_at ? "table-success text-white" : ""}
            >
              <td>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0"
                  onClick={() =>
                    todo.completed_at
                      ? incompleteTodo(todo.id)
                      : completeTodo(todo.id)
                  }
                  aria-label={
                    todo.completed_at ? "Mark incomplete" : "Mark complete"
                  }
                >
                  {todo.completed_at ? (
                    <BsCheckSquare size={20} />
                  ) : (
                    <BsSquare size={20} />
                  )}
                </Button>
              </td>
              <td>{new Date(todo.due_date).toLocaleDateString()}</td>
              <td>{todo.name}</td>
              <td>
                <Badge bg={getBadgeVariant(todo.priority)}>
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </Badge>
              </td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default TaskList;
