import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { Card, Container } from 'react-bootstrap';
import useAuthStore from '../stores/authStore';

function TaskContainer() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <Container className="task-container">
      <Card className="shadow-sm">
        <Card.Header>
          <h1 className="mb-0">Todo Manager</h1>
        </Card.Header>
        <Card.Body>
          <TaskForm />
          <h2>My Tasks</h2>
          <TaskList />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TaskContainer; 