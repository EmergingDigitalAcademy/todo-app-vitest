import { Sequelize } from 'sequelize';
import config from '../config/database.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = {
  ...config[env],
  logging: process.env.NODE_ENV === 'test' ? false : console.log
};

export const sequelize = new Sequelize(dbConfig);

// Test the connection
try {
  await sequelize.authenticate();
  console.log('Database connection established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}