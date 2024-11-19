const express = require('express');
const sequelize = require('./db');
const Task = require('./models/task');
const taskRoutes = require('./routes/taskRoutes')

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());


app.use(express.json());
app.use('/api',taskRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Task Management API!');
  });

// Test database connection and sync models
sequelize.authenticate()
    .then(() => {
        console.log('Connection to database established.');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Models synchronized with the database.');
    })
    .catch(err => {
        console.error('Unable to connect to database:', err);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
