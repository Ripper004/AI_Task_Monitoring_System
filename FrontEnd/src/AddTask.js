import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, CircularProgress, TextField, Snackbar, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const AddTask = ({ addTask, isSubmitting }) => {
    const [task, setTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        status: 'Pending'
    });
    const [tasks, setTasks] = useState([]); // Store tasks from server here
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Fetch tasks from the server only once
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tasks');
                setTasks(response.data); // Store the fetched tasks in state
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setSnackbarMessage('Failed to load tasks');
                setSnackbarOpen(true);
            }
        };

        fetchTasks();
    }, []); // Empty dependency means this runs once after the initial render

    // Handle input changes and update state
    const handleInputChange = (name, value) => {
        setTask(prevTask => ({
            ...prevTask,
            [name]: value
        }));
    };

    // Handle form submission to add a new task
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!task.title || !task.description || !task.dueDate || !task.status) {
            setSnackbarMessage('All fields are required!');
            setSnackbarOpen(true);
            setLoading(false);
            return;
        }

        try {
            console.log('Submitting task:', task);
            const response = await axios.post('http://localhost:5000/api/tasks', task);
            console.log('Response:', response);

            // Dynamically update the task list by adding the new task to the state
            setTasks((prevTasks) => [...prevTasks, response.data]); // Adds the new task dynamically

            setSnackbarMessage('Task added successfully!');
            setSnackbarOpen(true);
            setTask({ title: '', description: '', dueDate: '', status: 'Pending' });
            window.location.replace(window.location.href);
        } catch (error) {
            setSnackbarMessage('Failed to add task');
            setSnackbarOpen(true);
            console.error('Error adding task:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Task Title */}
            <TextField
                label="Task Title"
                name="title"
                value={task.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                fullWidth
                margin="normal"
            />

            {/* Task Description */}
            <TextField
                label="Description"
                name="description"
                value={task.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
            />

            {/* Due Date */}
            <TextField
                label="Due Date"
                type="date"
                name="dueDate"
                value={task.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />

            {/* Task Status */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                    name="status"
                    value={task.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    required
                >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                </Select>
            </FormControl>

            {/* Submit Button */}
            <Button type="submit" fullWidth disabled={loading} variant="contained" color="primary" style={{ marginTop: '20px' }}>
                {loading ? <CircularProgress size={24} /> : 'Add Task'}
            </Button>

            {/* Snackbar Feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />
        </form>
    );
};

export default AddTask;
