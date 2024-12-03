import { sequelize } from '../models/index.js';

async function showSchema() {
  try {
    // Get all table information
    const tables = await sequelize.getQueryInterface().showAllTables();
    
    for (const tableName of tables) {
      console.log(`\nTable: ${tableName}`);
      
      // Get table description (columns and their types)
      const tableDesc = await sequelize.getQueryInterface().describeTable(tableName);
      
      // Format and display column information
      Object.entries(tableDesc).forEach(([columnName, details]) => {
        console.log(`  ${columnName}:`);
        console.log(`    type: ${details.type}`);
        console.log(`    nullable: ${details.allowNull}`);
        if (details.defaultValue) console.log(`    default: ${details.defaultValue}`);
        if (details.primaryKey) console.log(`    primaryKey: true`);
      });
    }
  } catch (error) {
    console.error('Error showing schema:', error);
  } finally {
    await sequelize.close();
  }
}

showSchema(); 