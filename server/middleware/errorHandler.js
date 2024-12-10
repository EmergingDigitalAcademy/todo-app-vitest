import { ValidationError, DatabaseError, UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';

export const sequelizeErrorHandler = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({ 
      error: error.errors.map(e => e.message)
    });
  }
  
  if (error instanceof UniqueConstraintError) {
    return res.status(409).json({ 
      error: 'Resource already exists'
    });
  }
  
  if (error instanceof ForeignKeyConstraintError) {
    return res.status(400).json({ 
      error: 'Invalid reference to related resource'
    });
  }
  
  if (error instanceof DatabaseError) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'A database error occurred'
    });
  }
  
  console.error('Unexpected error:', error);
  res.status(500).json({ 
    error: 'An unexpected error occurred'
  });
}; 