import express from 'express';
import todosRouter from './routes/todos.router.js';
const PORT = process.env.PORT || 5001;

const app = express();
app.use(express.json());

// Mount the todos router at /api/todos
app.use('/api/todos', todosRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
