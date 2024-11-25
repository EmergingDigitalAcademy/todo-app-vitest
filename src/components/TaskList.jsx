import { useEffect } from 'react';
import useTodoStore from '../stores/todoStore';

function TaskList() {
  const { todos, isLoading, error, fetchTodos, deleteTodo, completeTodo } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="task-list">
      {todos.map(todo => (
        <div key={todo.id} className={`task-item ${todo.priority}`}>
          <div className="task-content">
            <h3>{todo.name}</h3>
            <div className="task-details">
              <span>Priority: {todo.priority}</span>
              <span>Due: {new Date(todo.due_date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="task-actions">
            <button 
              onClick={() => completeTodo(todo.id)}
              className={todo.completed_at ? 'completed' : ''}
            >
              {todo.completed_at ? '✓' : 'Complete'}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList; 