import { useEffect } from 'react';
import useTodoStore from '../stores/todoStore';
import { ListGroup, Badge, Button, Spinner, Alert } from 'react-bootstrap';

function TaskList() {
  const { todos, isLoading, error, fetchTodos, deleteTodo, completeTodo } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  if (isLoading) return <Spinner animation="border" role="status" />;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
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
              variant={todo.completed_at ? 'success' : 'outline-success'}
              size="sm"
              className="me-2"
              onClick={() => completeTodo(todo.id)}
            >
              {todo.completed_at ? '✓' : 'Complete'}
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
  );
}

export default TaskList; 