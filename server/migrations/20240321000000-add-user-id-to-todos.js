export async function up({ context: queryInterface, DataTypes }) {
  // First add the column as nullable
  await queryInterface.addColumn('todos', 'user_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });

  await queryInterface.addIndex('todos', ['user_id']);
}

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('todos', 'user_id');
} 