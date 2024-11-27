import { sequelize } from '../models/index.js';
import Todo from '../models/todo.js';

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

export { Todo }; 