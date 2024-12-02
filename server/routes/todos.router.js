import express from 'express';
import Todo from '../models/todo.js';
import validateTodo from '../middleware/todoValidation.js';
import { rejectUnauthenticated } from '../middleware/auth.js';

const router = express.Router();

// Add authentication middleware to all routes
router.use(rejectUnauthenticated);

// Create todo
router.post('/', validateTodo, async (req, res) => {
  try {
    const { name, priority, due_date } = req.body;
    const todo = await Todo.create({ 
      name, 
      priority, 
      due_date,
      user_id: req.user.id // Add user_id from authenticated user
    });
    res.status(201).json(todo);
  } catch (error) {
    console.error('POST /todos error:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// Read all todos (for current user only)
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: {
        user_id: req.user.id // Only get todos for current user
      },
      order: [
        ['completed_at', 'ASC'],
      ],
    });
    res.json(todos);
  } catch (error) {
    console.error('GET /todos error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Read single todo (verify ownership)
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id // Ensure todo belongs to current user
      }
    });
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

// Update todo (verify ownership)
router.put('/:id', async (req, res) => {
  try {
    const { name, priority, due_date, completed_at } = req.body;
    
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ 
        error: 'priority must be low, medium, or high' 
      });
    }

    const todo = await Todo.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id // Ensure todo belongs to current user
      }
    });
    
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

// Delete todo (verify ownership)
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id // Ensure todo belongs to current user
      }
    });
    
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