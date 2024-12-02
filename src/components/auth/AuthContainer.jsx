import { useEffect } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import useAuthStore from '../../stores/authStore';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthContainer() {
  const { user, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (user) {
    return (
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span>Welcome, {user.username}!</span>
        <Button variant="outline-danger" onClick={logout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h2>Login</h2>
            </Card.Header>
            <Card.Body>
              <LoginForm />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>
              <h2>Register</h2>
            </Card.Header>
            <Card.Body>
              <RegisterForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AuthContainer; 