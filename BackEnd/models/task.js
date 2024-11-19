const {  DataTypes } = require('sequelize');
const sequelize = require('../db');   // Get Sequelize instance from server.js

// Define the Task model/schema
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending','completed'),
    defaultValue: 'pending',
  }  
});

// Sync the model with the database (creating the table if it doesn't exist)
Task.sync({ force: true });

module.exports = Task;
