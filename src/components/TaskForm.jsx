import { useState } from 'react';
import useTodoStore from '../stores/todoStore';

function TaskForm() {
  const addTodo = useTodoStore(state => state.addTodo);
  const [formData, setFormData] = useState({
    name: '',
    priority: 'medium',
    due_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTodo(formData);
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
    <form onSubmit={handleSubmit} className="task-form">
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
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm; 