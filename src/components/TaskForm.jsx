import { useState } from 'react';
import useTodoStore from '../stores/todoStore';

function TaskForm() {
  const { addTodo } = useTodoStore();
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
    <form 
      onSubmit={handleSubmit} 
      className="task-form" 
      aria-label="Add todo form"
    >
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Task name"
        required
      />
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="date"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
        role="date"
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm; 