import express from 'express';
import { dbPromise } from '../modules/db.js';
import validateTodo from '../middleware/todoValidation.js';

const router = express.Router();

// Create todo
router.post('/', validateTodo, async (req, res) => {
  try {
    const { name, priority, due_date } = req.body;
    const db = await dbPromise;
    console.log('Got DB connection:', !!db);
    
    const result = await db.run(
      `INSERT INTO todos (name, priority, due_date) 
       VALUES (?, ?, ?)`,
      [name, priority, due_date]
    );
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    console.error('POST /todos error:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// Read all todos
router.get('/', async (req, res) => {
  try {
    const db = await dbPromise;
    const todos = await db.all('SELECT * FROM todos');
    res.json(todos);
  } catch (error) {
    console.error('GET /todos error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Read single todo
router.get('/:id', async (req, res) => {
  try {
    const db = await dbPromise;
    const todo = await db.get('SELECT * FROM todos WHERE id = ?', req.params.id);
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
    const db = await dbPromise;
    const result = await db.run(
      `UPDATE todos 
       SET name = ?, priority = ?, due_date = ?, completed_at = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, priority, due_date, completed_at, req.params.id]
    );
    if (result.changes > 0) {
      res.json({ message: 'Todo updated successfully' });
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('PUT /todos/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete todo
router.delete('/:id', async (req, res) => {
  try {
    const db = await dbPromise;
    const result = await db.run('DELETE FROM todos WHERE id = ?', req.params.id);
    if (result.changes > 0) {
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