import { useState } from 'react';
import useTodoStore from '../stores/todoStore';
import { Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';

function TaskForm() {
  const { addTodo, isLoading, error } = useTodoStore();
  const [formData, setFormData] = useState({
    name: '',
    priority: 'medium',
    due_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo({
      name: formData.name,
      priority: formData.priority,
      due_date: formData.due_date
    });
    setFormData({
      name: '',
      priority: 'medium',
      due_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <>
      {error && <Alert variant="danger" className="mb-3">Error: {error}</Alert>}
      <Form onSubmit={handleSubmit} className="mb-4" aria-label="Add todo form">
        <Row className="g-3">
          <Col sm={12}>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Task name"
              required
            />
          </Col>
          <Col sm={6}>
            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Col>
          <Col sm={6}>
            <Form.Control
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              role="date"
            />
          </Col>
          <Col sm={12}>
            <Button type="submit" disabled={isLoading} variant="primary" className="w-100">
              {isLoading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  className="me-2"
                />
              )}
              Add Task
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default TaskForm; 