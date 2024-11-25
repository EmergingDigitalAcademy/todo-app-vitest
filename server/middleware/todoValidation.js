const validateTodo = (req, res, next) => {
  const { name, priority } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  if (!priority) {
    return res.status(400).json({ error: 'priority is required' });
  }

  if (!['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ 
      error: 'priority must be low, medium, or high' 
    });
  }

  next();
};

export default validateTodo; 