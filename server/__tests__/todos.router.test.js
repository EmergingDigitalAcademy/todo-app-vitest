import request from 'supertest';
import express from 'express';
import { initTestDb, Todo, createTestTodo } from './setup.js';
import { vi, beforeAll, beforeEach, afterAll, describe, it, expect } from 'vitest';
import todosRouter from '../routes/todos.router.js';

describe('Todos API', () => {
  let app;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/todos', todosRouter);
  });

  beforeEach(async () => {
    await initTestDb();
  });

  describe('POST /api/todos', () => {
    it('creates a new todo', async () => {
      const newTodo = {
        name: 'Test Todo',
        priority: 'high',
        due_date: '2024-03-20'
      };

      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .expect(201);

      // Check response matches input, ignoring date format differences
      expect(response.body.name).toBe(newTodo.name);
      expect(response.body.priority).toBe(newTodo.priority);
      expect(new Date(response.body.due_date)).toEqual(new Date(newTodo.due_date));
      expect(response.body.id).toBeDefined();

      // Verify database state
      const todo = await Todo.findByPk(response.body.id);
      expect(todo.name).toBe(newTodo.name);
      expect(todo.priority).toBe(newTodo.priority);
      expect(todo.due_date.toISOString().split('T')[0]).toBe(newTodo.due_date);
    });
  });

  describe('GET /api/todos', () => {
    it('returns all todos', async () => {
      // Create test todos
      await createTestTodo({ name: 'Todo 1' });
      await createTestTodo({ name: 'Todo 2' });

      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Todo 1');
      expect(response.body[1].name).toBe('Todo 2');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('updates an existing todo with partial data', async () => {
      const todo = await createTestTodo({
        name: 'Original Todo',
        priority: 'high',
        due_date: '2024-03-20'
      });

      const updates = {
        name: 'Updated Todo'
      };

      const response = await request(app)
        .put(`/api/todos/${todo.id}`)
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe('Updated Todo');
      expect(response.body.priority).toBe('high'); // Original value preserved
      
      // Verify database state
      const updated = await Todo.findByPk(todo.id);
      expect(updated.name).toBe('Updated Todo');
      expect(updated.priority).toBe('high');
    });

    it('validates priority on update', async () => {
      const todo = await createTestTodo({ name: 'Test Todo' });

      await request(app)
        .put(`/api/todos/${todo.id}`)
        .send({ priority: 'invalid' })
        .expect(400)
        .expect(res => {
          expect(res.body.error).toBe('priority must be low, medium, or high');
        });
    });

    it('handles completed_at updates', async () => {
      const todo = await createTestTodo({ name: 'Test Todo' });
      const completed_at = new Date().toISOString();

      const response = await request(app)
        .put(`/api/todos/${todo.id}`)
        .send({ completed_at })
        .expect(200);

      // Compare dates by converting both to Date objects
      expect(new Date(response.body.completed_at)).toEqual(new Date(completed_at));
      
      // Verify database state
      const updated = await Todo.findByPk(todo.id);
      expect(new Date(updated.completed_at)).toEqual(new Date(completed_at));
    });

    it('returns 404 for non-existent todo', async () => {
      await request(app)
        .put('/api/todos/999999')
        .send({ name: 'Updated Todo' })
        .expect(404)
        .expect(res => {
          expect(res.body.error).toBe('Todo not found');
        });
    });
  });
}); 