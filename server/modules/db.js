import { sequelize } from '../models/index.js';
import Todo from '../models/todo.js';

// Run migrations on startup
async function initializeDb() {
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
}

initializeDb();

export { Todo }; 