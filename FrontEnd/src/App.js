import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './TaskList';
import AddTask from './AddTask';
import './App.css';

function App() {
  const [tasks, setTasks] = useState({ pending: [], completed: [] });
  const [loading, setLoading] = useState(true);

  // Fetch tasks from backend when the app loads
  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then((response) => {
        const allTasks = response.data;

        // Separate tasks into pending and completed based on status
        const pendingTasks = allTasks.filter(task => task.status !== 'Completed');
        const completedTasks = allTasks.filter(task => task.status === 'Completed');

        // Sort pending tasks by time remaining and priority
        const sortedPendingTasks = pendingTasks.sort((a, b) => {
          const timeRemainingA = new Date(a.dueDate) - new Date();
          const timeRemainingB = new Date(b.dueDate) - new Date();

          if (timeRemainingA === timeRemainingB) {
            const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }

          return timeRemainingA - timeRemainingB;
        });

        setTasks({ pending: sortedPendingTasks, completed: completedTasks });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      });
  }, []);

  // Add task to the list
  const addTask = (newTask) => {
    axios.post('http://localhost:5000/api/tasks', newTask)
      .then((response) => {
        setTasks(prevTasks => {
          const updatedTasks = { 
            pending: [...prevTasks.pending, response.data].sort((a, b) => {
              const timeRemainingA = new Date(a.dueDate) - new Date();
              const timeRemainingB = new Date(b.dueDate) - new Date();

              if (timeRemainingA === timeRemainingB) {
                const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              }

              return timeRemainingA - timeRemainingB;
            }),
            completed: prevTasks.completed
          };
          return updatedTasks;
        });
      })
      .catch((error) => {
        console.error('Error adding task:', error);
      });
  };

  return (
    <div className="app-container">
      <h1><center>TASK MANAGEMENT</center></h1>
      <div className="layout">
        <div className="left-pane">
          <h1><center>ADD TASKS</center></h1>
          {loading ? (
            <div className="loading">
              <div className="loader"></div>
            </div>
          ) : (
            <AddTask addTask={addTask} existingTasks={[...tasks.pending, ...tasks.completed]} />
          )}
        </div>
        <div className="right-pane">          
            <h1><center>VIEW TASKS</center></h1>
            {loading ? (
              <div className="loading">
                <div className="loader"></div>
              </div>
            ) : (
              <TaskList tasks={tasks.pending} setTasks={setTasks} />
            )}
          {/* Completed Tasks */}
          {/* <div className="completed-tasks">
            <h1><center>COMPLETED TASKS</center></h1>
            {loading ? (
              <div className="loading">
                <div className="loader"></div>
              </div>
            ) : (
              <TaskList tasks={tasks.completed} setTasks={setTasks}  />
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;


