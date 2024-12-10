import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index.js';
import User from './user.js';

class Todo extends Model {}

Todo.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'name is required'
      },
      notEmpty: {
        msg: 'name cannot be empty'
      }
    }
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'priority is required'
      },
      isIn: {
        args: [['low', 'medium', 'high']],
        msg: 'priority must be low, medium, or high'
      }
    }
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Todo',
  tableName: 'todos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define association
Todo.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Todo, { foreignKey: 'user_id' });

export default Todo; 