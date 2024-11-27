import express from 'express';
import { Todo } from '../modules/db.js';
import validateTodo from '../middleware/todoValidation.js';

const router = express.Router();

// Create todo
router.post('/', validateTodo, async (req, res) => {
  try {
    const { name, priority, due_date } = req.body;
    const todo = await Todo.create({ name, priority, due_date });
    res.status(201).json(todo);
  } catch (error) {
    console.error('POST /todos error:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// Read all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (error) {
    console.error('GET /todos error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Read single todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('GET /todos/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update todo
router.put('/:id', async (req, res) => {
  try {
    const { name, priority, due_date, completed_at } = req.body;
    
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ 
        error: 'priority must be low, medium, or high' 
      });
    }

    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Only update fields that are provided
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (priority !== undefined) updates.priority = priority;
    if (due_date !== undefined) updates.due_date = due_date;
    if (completed_at !== undefined) updates.completed_at = completed_at;

    await todo.update(updates);
    res.json(todo);
  } catch (error) {
    console.error('PUT /todos/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      await todo.destroy();
      res.json({ message: 'Todo deleted successfully' });
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('DELETE /todos/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 