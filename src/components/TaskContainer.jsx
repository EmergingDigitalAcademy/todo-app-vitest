import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { Card, Container } from 'react-bootstrap';

function TaskContainer() {
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