import express from 'express';
import cookieSession from 'cookie-session';
import passport from './config/passport.js';
import todosRouter from './routes/todos.router.js';
import userRouter from './routes/user.router.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Set up express static file server
app.use(express.static('dist'));

// Parse JSON bodies
app.use(express.json());

// Session middleware
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'your-secret-key'],
  maxAge: 1000 * 60 * 60 * 24 // 24 hours
}));

// Initialize passport
app.use(passport.initialize());

// Mount routers
app.use('/api/users', userRouter);
app.use('/api/todos', todosRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
