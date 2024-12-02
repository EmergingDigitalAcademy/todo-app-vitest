import { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import useAuthStore from '../stores/authStore';

function Login() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/tasks');
    }
  }, [user, navigate]);

  return (
    <Container className="p-4">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6}>
          <Card className="shadow-sm">
            <Card.Header>
              <h2>Login</h2>
            </Card.Header>
            <Card.Body>
              <LoginForm />
              <div className="text-center mt-3">
                Don't have an account? <Link to="/register">Register here</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login; 