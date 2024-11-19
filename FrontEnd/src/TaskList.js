import React from 'react';
import axios from 'axios';

function TaskList({ tasks, setTasks }) {
  // Calculate time remaining for each task
  const calculateTimeRemaining = (dueDate) => {
    const dueDateObj = new Date(dueDate);
    const now = new Date();
    const timeDiff = dueDateObj - now;

    if (timeDiff <= 0) {
      return 'Due now';
    }

    const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return `${daysRemaining}d ${hoursRemaining}h ${minutesRemaining}m remaining`;
  };

  // Handle task deletion
  const handleDelete = (taskId) => {
    axios.delete(`http://localhost:5000/api/tasks/${taskId}`)
      .then((response) => {
        alert('Task deleted successfully!');
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId)); // Update task list
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  };

  // Placeholder for task editing functionality
  const handleEdit = (taskId) => {
    alert('Task editing functionality goes here!');
  };

  // Sort tasks to ensure "completed" tasks appear at the bottom
  const sortedTasks = tasks.sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (b.status === 'completed' && a.status !== 'completed') return -1;
    return 0; // If both tasks have the same status, maintain their order
  });

  return (
    <div className="tasks-list">
      {sortedTasks.length === 0 ? (
        <p>No tasks available. Add a new task!</p>
      ) : (
        sortedTasks.map((task) => (
          <div key={task.id} className="task">
            <div>
              <h3>{task.title}</h3> {/* Ensure task title aligns with your data */}
              <p>{task.description}</p>
              <p>Due: {new Date(task.dueDate).toLocaleString()}</p>
              <p>Time Remaining: {calculateTimeRemaining(task.dueDate)}</p>
            </div>
            <div className="task-actions">
              <span className={`task-status ${task.status.toLowerCase()}`}>
                {task.status}
              </span>
              <button className="task-button delete-btn" onClick={() => handleDelete(task.id)}>Delete</button>
              <button className="task-button edit-btn" onClick={() => handleEdit(task.id)}>Edit</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;


