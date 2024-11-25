import express from 'express';
import todosRouter from './routes/todos.router.js';
const PORT = process.env.PORT || 5001;

const app = express(PORT);
app.use(express.json());

// Mount the todos router at /api/todos
app.use('/api/todos', todosRouter);

export default app;