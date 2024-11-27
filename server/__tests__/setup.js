import { sequelize } from '../models/index.js';
import Todo from '../models/todo.js';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

export async function initTestDb() {
  await sequelize.sync({ force: true });
}

export async function createTestTodo(data) {
  return Todo.create({
    name: data.name || 'Test Todo',
    priority: data.priority || 'medium',
    due_date: data.due_date || new Date(),
    ...data
  });
}

export async function createTestUser(data) {
  const password_hash = await bcrypt.hash(data.password || 'password123', 10);
  return User.create({
    username: data.username || 'testuser',
    password_hash,
    ...data
  });
}

export { Todo, User }; 