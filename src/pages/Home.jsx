import { Container, Row, Col } from 'react-bootstrap';
import TaskContainer from '../components/TaskContainer';
import useAuthStore from '../stores/authStore';

function Home() {
  const { user, logout } = useAuthStore();

  return (
    <Container className="p-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Welcome, {user?.username}!</span>
            <button className="btn btn-outline-danger" onClick={logout}>
              Logout
            </button>
          </div>
          <TaskContainer />
        </Col>
      </Row>
    </Container>
  );
}

export default Home; 