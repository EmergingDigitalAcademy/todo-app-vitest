import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { Card, Container } from 'react-bootstrap';

function TaskContainer() {
  return (
    <Container className="task-container">
      <Card className="shadow-sm">
        <Card.Header>
          <h2 className="mb-0">Todo Manager</h2>
        </Card.Header>
        <Card.Body>
          <TaskForm />
          <TaskList />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TaskContainer; 