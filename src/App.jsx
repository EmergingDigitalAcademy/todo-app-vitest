import './App.css'
import TaskContainer from './components/TaskContainer'
import { Container, Row, Col } from 'react-bootstrap'

function App() {
  return (
    <Container className="p-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <TaskContainer />
        </Col>
      </Row>
    </Container>
  )
}

export default App
