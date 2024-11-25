import TaskForm from './TaskForm';
import TaskList from './TaskList';

function TaskContainer() {
  return (
    <div className="task-container">
      <h2>Todo Manager</h2>
      <TaskForm />
      <TaskList />
    </div>
  );
}

export default TaskContainer; 