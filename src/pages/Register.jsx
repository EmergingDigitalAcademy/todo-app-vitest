import { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import useAuthStore from '../stores/authStore';

function Register() {
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
              <h2>Register</h2>
            </Card.Header>
            <Card.Body>
              <RegisterForm />
              <div className="text-center mt-3">
                Already have an account? <Link to="/login">Login here</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register; 