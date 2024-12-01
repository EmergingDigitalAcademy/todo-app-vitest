import express from 'express';
import session from 'express-session';
import passport from './config/passport.js';
import todosRouter from './routes/todos.router.js';
import userRouter from './routes/user.router.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Mount routers
app.use('/api/users', userRouter);
app.use('/api/todos', todosRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
