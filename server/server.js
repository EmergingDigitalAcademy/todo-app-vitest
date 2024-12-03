import express from 'express';
import cookieSession from 'cookie-session';
import passport from './config/passport.js';
import todosRouter from './routes/todos.router.js';
import userRouter from './routes/user.router.js';
import path from 'path';
import session from 'express-session';
const app = express();
const PORT = process.env.PORT || 5001;

// use express session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Other middleware
app.use(express.static('dist'));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Mount routers
app.use('/api/users', userRouter);
app.use('/api/todos', todosRouter);

app.get('*', (req, res) => {
  console.log('sending index.html')
  res.sendFile(path.resolve('dist', 'index.html'))
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
