import request from 'supertest';
import express from 'express';
import session from 'express-session';
import passport from '../config/passport.js';
import { initTestDb, createTestUser, User } from './setup.js';
import userRouter from '../routes/user.router.js';

describe('User Authentication API', () => {
  let app;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    
    // Setup session and passport for tests
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use('/api/users', userRouter);
  });

  beforeEach(async () => {
    await initTestDb();
  });

  describe('POST /api/users/register', () => {
    it('registers a new user', async () => {
      const newUser = {
        username: 'testuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(newUser)
        .expect(201);

      expect(response.body.username).toBe(newUser.username);
      expect(response.body.id).toBeDefined();
      expect(response.body.password_hash).toBeUndefined();

      // Verify user was created in database
      const user = await User.findByPk(response.body.id);
      expect(user.username).toBe(newUser.username);
      expect(user.password_hash).toBeDefined();
    });

    it('prevents duplicate usernames', async () => {
      await createTestUser({ username: 'testuser' });

      await request(app)
        .post('/api/users/register')
        .send({ username: 'testuser', password: 'password123' })
        .expect(400)
        .expect(res => {
          expect(res.body.error).toBe('Username already exists');
        });
    });
  });

  describe('POST /api/users/login', () => {
    it('logs in with valid credentials', async () => {
      const user = await createTestUser({
        username: 'testuser',
        password: 'password123'
      });

      const response = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.username).toBe(user.username);
      expect(response.body.id).toBe(user.id);
    });

    it('rejects invalid credentials', async () => {
      await createTestUser({
        username: 'testuser',
        password: 'password123'
      });

      await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        })
        .expect(401);
    });
  });

  describe('GET /api/users/current', () => {
    it('returns current user when authenticated', async () => {
      const agent = request.agent(app);
      const user = await createTestUser({
        username: 'testuser',
        password: 'password123'
      });

      // Login first
      await agent
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      // Then check current user
      const response = await agent
        .get('/api/users/current')
        .expect(200);

      expect(response.body.username).toBe(user.username);
      expect(response.body.id).toBe(user.id);
    });

    it('returns 401 when not authenticated', async () => {
      await request(app)
        .get('/api/users/current')
        .expect(401)
        .expect(res => {
          expect(res.body.error).toBe('Not authenticated');
        });
    });
  });

  describe('POST /api/users/logout', () => {
    it('logs out successfully', async () => {
      const agent = request.agent(app);
      
      // Login first
      await createTestUser({
        username: 'testuser',
        password: 'password123'
      });
      
      await agent
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      // Then logout
      await agent
        .post('/api/users/logout')
        .expect(200)
        .expect(res => {
          expect(res.body.message).toBe('Logged out successfully');
        });

      // Verify we're logged out
      await agent
        .get('/api/users/current')
        .expect(401);
    });
  });
}); 