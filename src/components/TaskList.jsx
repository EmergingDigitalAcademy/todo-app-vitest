import { useEffect } from 'react';
import useTodoStore from '../stores/todoStore';
import { ListGroup, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { BsCheckSquare, BsSquare } from 'react-icons/bs';

function TaskList() {
  const { todos, isLoading, error, fetchTodos, deleteTodo, completeTodo, incompleteTodo } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <>
      {isLoading && (
        <Spinner
      style={{
        position: 'fixed',
            bottom: '20px',
            right: '20px', 
            zIndex: 1000
          }}
          animation="border" role="status" />
      )}
      <ListGroup>
        {todos.map(todo => (
        <ListGroup.Item 
            key={todo.id}
            className={`d-flex justify-content-between align-items-center ${todo.completed_at ? 'bg-light' : ''}`}
          >
            <div>
              <h5 className="mb-1">{todo.name}</h5>
              <div className="small text-muted">
                <Badge bg={todo.priority === 'high' ? 'danger' : todo.priority === 'medium' ? 'warning' : 'info'}>
                  {todo.priority}
                </Badge>
                <span className="ms-2">Due: {new Date(todo.due_date).toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <Button
                variant="link"
                size="sm"
                className="me-2 p-0"
                onClick={() => todo.completed_at ? incompleteTodo(todo.id) : completeTodo(todo.id)}
                aria-label={todo.completed_at ? "Mark incomplete" : "Mark complete"}
              >
                {todo.completed_at ? <BsCheckSquare size={20} /> : <BsSquare size={20} />}
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}

export default TaskList; 