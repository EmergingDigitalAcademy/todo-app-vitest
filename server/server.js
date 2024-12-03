import express from 'express';
import cookieSession from 'cookie-session';
import passport from './config/passport.js';
import todosRouter from './routes/todos.router.js';
import userRouter from './routes/user.router.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5001;

// Cookie session middleware
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'your-secret-key'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
}));

// Add these compatibility methods for Passport
app.use((req, res, next) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => cb();
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => cb();
  }
  next();
});

// Other middleware
app.use(express.static('dist'));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Mount routers
app.use('/api/users', userRouter);
app.use('/api/todos', todosRouter);

// app.get('*', (req, res) => {
//   console.log('sending index.html')
//   res.sendFile(path.resolve('dist', 'index.html'))
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
