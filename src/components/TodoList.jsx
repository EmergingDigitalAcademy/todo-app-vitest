import { useEffect } from 'react';
import useTodoStore from '../stores/todoStore';

function TodoList() {
  const { todos, isLoading, error, fetchTodos, addTodo, updateTodo, deleteTodo, completeTodo } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleAddTodo = async () => {
    await addTodo({
      name: "New Todo",
      priority: "medium",
      due_date: new Date().toISOString()
    });
  };

  return (
    <div>
      <button onClick={handleAddTodo}>Add Todo</button>
      {todos.map(todo => (
        <div key={todo.id}>
          <span>{todo.name}</span>
          <span>{todo.priority}</span>
          <button onClick={() => completeTodo(todo.id)}>
            {todo.completed_at ? '✓' : 'Mark Complete'}
          </button>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default TodoList; 