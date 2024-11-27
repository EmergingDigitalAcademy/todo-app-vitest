export default {
  development: {
    dialect: 'sqlite',
    storage: './server/todos.db'
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:'
  },
  production: {
    dialect: 'sqlite',
    storage: './server/todos.db'
  }
}; 