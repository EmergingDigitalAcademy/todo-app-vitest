import request from 'supertest';
import express from 'express';
import { getTestDb, initTestDb } from './setup.js';
import { vi, beforeAll, beforeEach, afterAll, describe, it, expect } from 'vitest';

// Shared database instance for both the router and test assertions
let testDb;

// Mock the database module to use our test database
// Uses a getter to ensure we always have access to the latest testDb instance
vi.mock('../modules/db.js', () => ({
  get dbPromise() {
    return Promise.resolve(testDb);
  }
}));

import todosRouter from '../routes/todos.router.js';

describe('Todos API', () => {
  let app;

  // Test setup: runs once before all tests
  beforeAll(async () => {
    // Initialize in-memory SQLite database
    testDb = await getTestDb();
    await initTestDb(testDb);
    
    // Create Express app instance with JSON parsing and router
    app = express();
    app.use(express.json());
    app.use('/api/todos', todosRouter);
  });

  // Reset database before each test
  beforeEach(async () => {
    await testDb.run('DELETE FROM todos');
  });

  // Cleanup: close database connection after all tests
  afterAll(async () => {
    await testDb.close();
  });

  describe('POST /api/todos', () => {
    // Happy path test: verifies successful todo creation
    it('creates a new todo', async () => {
      const newTodo = {
        name: 'Test Todo',
        priority: 'high',
        due_date: '2024-03-20'
      };

      // Use supertest to make HTTP requests to our Express app
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .expect(201);  // Assert correct status code

      // Verify response has expected structure
      expect(response.body).toHaveProperty('id');
      
      // Verify database state directly
      const todo = await testDb.get('SELECT * FROM todos WHERE id = ?', response.body.id);
      expect(todo).toMatchObject(newTodo);
    });

    // Validation test: missing required field
    it('validates required fields', async () => {
      const invalidTodo = {
        priority: 'high',
        due_date: '2024-03-20'
      };

      await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .expect(400)
        .expect(res => {
          expect(res.body.error).toContain('name is required');
        });
    });

    // Validation test: invalid enum value
    it('validates priority values', async () => {
      const invalidTodo = {
        name: 'Test Todo',
        priority: 'invalid',
        due_date: '2024-03-20'
      };

      await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .expect(400)
        .expect(res => {
          expect(res.body.error).toContain('priority must be low, medium, or high');
        });
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('updates an existing todo', async () => {
      // First create a todo
      const todo = await testDb.run(
        'INSERT INTO todos (name, priority, due_date) VALUES (?, ?, ?)',
        ['Test Todo', 'high', '2024-03-20']
      );

      const updates = {
        name: 'Updated Todo',
        priority: 'low',
        completed_at: '2024-03-21T00:00:00.000Z'
      };

      await request(app)
        .put(`/api/todos/${todo.lastID}`)
        .send(updates)
        .expect(200)
        .expect(res => {
          expect(res.body).toMatchObject(updates);
        });

      // Verify database state
      const updated = await testDb.get('SELECT * FROM todos WHERE id = ?', todo.lastID);
      expect(updated).toMatchObject(updates);
    });

    it('returns 404 for non-existent todo', async () => {
      await request(app)
        .put('/api/todos/999')
        .send({ name: 'Updated Todo' })
        .expect(404);
    });

    it('validates update data', async () => {
      const todo = await testDb.run(
        'INSERT INTO todos (name, priority, due_date) VALUES (?, ?, ?)',
        ['Test Todo', 'high', '2024-03-20']
      );

      await request(app)
        .put(`/api/todos/${todo.lastID}`)
        .send({ priority: 'invalid' })
        .expect(400)
        .expect(res => {
          expect(res.body.error).toContain('priority must be low, medium, or high');
        });
    });
  });
}); 