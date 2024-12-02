import { useEffect } from "react";
import useTodoStore from "../stores/todoStore";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
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

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <>
      {isLoading && (
        <Spinner
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
          animation="border"
          role="status"
        />
      )}
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
              <td
                className={`${
                  todo.priority === "medium"
                    ? "fw-bold"
                    : todo.priority === "high"
                    ? "text-danger"
                    : ""
                }`}
                style={{
                  textShadow: todo.priority === "high" ? "1px 1px 2px red" : "",
                }}
              >
                {todo.name}
              </td>
              <td>{todo.priority}</td>
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
