import request from 'supertest';
import express from 'express';
import session from 'express-session';
import passport from '../config/passport.js';
import { initTestDb, Todo, createTestTodo, createTestUser } from './setup.js';
import todosRouter from '../routes/todos.router.js';
import userRouter from '../routes/user.router.js';

describe('Todos API', () => {
  let app;
  let authenticatedUser;
  let agent;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    
    // Add session and passport middleware for authentication
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    
    // Add both routers for proper authentication
    app.use('/api/users', userRouter);
    app.use('/api/todos', todosRouter);
    
    // Create a reusable authenticated agent
    agent = request.agent(app);
  });

  beforeEach(async () => {
    await initTestDb();
    
    // Create test user
    authenticatedUser = await createTestUser({
      username: 'testuser',
      password: 'password123'
    });
    
    // Login the user
    await agent
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'password123'
      })
      .expect(200);
  });

  describe('POST /api/todos', () => {
    it('creates a new todo for authenticated user', async () => {
      const newTodo = {
        name: 'Test Todo',
        priority: 'high',
        due_date: '2024-03-20'
      };

      const response = await agent
        .post('/api/todos')
        .send(newTodo)
        .expect(201);

      expect(response.body.name).toBe(newTodo.name);
      expect(response.body.priority).toBe(newTodo.priority);
      // expect(new Date(response.body.due_date)).toEqual(new Date(newTodo.due_date));
      // expect(response.body.id).toBeDefined();
      expect(response.body.user_id).toBe(authenticatedUser.id);


      // Verify database state
      const todo = await Todo.findByPk(response.body.id);
      expect(todo.user_id).toBe(authenticatedUser.id);
    });

    it('rejects unauthenticated requests', async () => {
      await request(app) // Using non-authenticated request
        .post('/api/todos')
        .send({
          name: 'Test Todo',
          priority: 'high'
        })
        .expect(401);
    });
  });

  describe('GET /api/todos', () => {
    it('returns only todos belonging to authenticated user', async () => {
      // Create todos for authenticated user
      await createTestTodo({ 
        name: 'User Todo 1',
        user_id: authenticatedUser.id 
      });
      await createTestTodo({ 
        name: 'User Todo 2',
        user_id: authenticatedUser.id 
      });

      // Create todo for different user
      const otherUser = await createTestUser({ 
        username: 'otheruser',
        password: 'password123' 
      });
      await createTestTodo({ 
        name: 'Other User Todo',
        user_id: otherUser.id 
      });

      const response = await agent
        .get('/api/todos')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.every(todo => todo.user_id === authenticatedUser.id)).toBe(true);
      expect(response.body.map(todo => todo.name)).toEqual(['User Todo 1', 'User Todo 2']);
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('updates todo only if it belongs to authenticated user', async () => {
      // Create todo for authenticated user
      const userTodo = await createTestTodo({
        name: 'Original Todo',
        priority: 'high',
        user_id: authenticatedUser.id
      });

      // Create todo for different user
      const otherUser = await createTestUser({ username: 'otheruser' });
      const otherTodo = await createTestTodo({
        name: 'Other Todo',
        user_id: otherUser.id
      });

      // Update own todo
      const response = await agent
        .put(`/api/todos/${userTodo.id}`)
        .send({ name: 'Updated Todo' })
        .expect(200);

      expect(response.body.name).toBe('Updated Todo');

      // Try to update other user's todo
      await agent
        .put(`/api/todos/${otherTodo.id}`)
        .send({ name: 'Hacked Todo' })
        .expect(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('deletes todo only if it belongs to authenticated user', async () => {
      // Create todos for both users
      const userTodo = await createTestTodo({
        name: 'User Todo',
        user_id: authenticatedUser.id
      });
      
      const otherUser = await createTestUser({ username: 'otheruser' });
      const otherTodo = await createTestTodo({
        name: 'Other Todo',
        user_id: otherUser.id
      });

      // Delete own todo
      await agent
        .delete(`/api/todos/${userTodo.id}`)
        .expect(200);

      // Verify own todo was deleted
      const deletedTodo = await Todo.findByPk(userTodo.id);
      expect(deletedTodo).toBeNull();

      // Try to delete other user's todo
      await agent
        .delete(`/api/todos/${otherTodo.id}`)
        .expect(404);

      // Verify other user's todo still exists
      const otherUserTodo = await Todo.findByPk(otherTodo.id);
      expect(otherUserTodo).not.toBeNull();
    });
  });
}); 