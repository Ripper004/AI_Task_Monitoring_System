const { Sequelize } = require('sequelize');

// Set up a new Sequelize instance (change database credentials as needed)
const sequelize = new Sequelize('task_management_db', 'root', 'Pro2004!!', {
    host: 'localhost',
    dialect: 'mysql'
});

// Export the sequelize instance
module.exports = sequelize;
