const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Create a new task
router.post('/tasks', async (req, res) => {
    try {
        const { title, description, dueDate, status } = req.body;

        // Check if a task with the same title, description, and due date already exists
        const existingTask = await Task.findOne({
            where: { title, description, dueDate }
        });

        if (existingTask) {
            return res.status(400).json({ message: 'Task with the same details already exists.' });
        }

        // Create a new task if it doesn't exist already
        const newTask = await Task.create({ title, description, dueDate, status });
        res.status(201).json(newTask);
    } catch (err) {
        console.error('Error adding task:', err);
        res.status(500).json({ message: 'Error creating task', error: err.message });
    }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving tasks', error: err.message });
    }
});

// Get a specific task by ID
router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving task', error: err.message });
    }
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (task) {
            const { title, description, dueDate, status } = req.body;
            task.title = title || task.title;
            task.description = description || task.description;
            task.dueDate = dueDate || task.dueDate;
            task.status = status || task.status;
            await task.save();
            res.status(200).json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating task', error: err.message });
    }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (task) {
            await task.destroy();
            res.status(204).json({ message: 'Task deleted' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
});

module.exports = router;
