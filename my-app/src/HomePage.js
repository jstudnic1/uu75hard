// HomePage.jsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar'; // Import the Sidebar component

const HomePage = () => {
  const { user, addTask } = useAuth();
  const [newTaskName, setNewTaskName] = useState('');

  const tasks = user && user.tasks ? user.tasks : [];

  const handleAddTask = async () => {
    if (newTaskName.trim()) {
      await addTask(newTaskName);
      setNewTaskName('');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="content flex-1 p-4">
        <h2>Tasks for Today:</h2>
        {tasks.length > 0 ? (
          <ul>
            {tasks.map((task) => (
              <li key={task.taskId}>{task.name} - {task.completed ? 'Done' : 'Pending'}</li>
            ))}
          </ul>
        ) : (
          <p>No tasks for today!</p>
        )}
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
    </div>
  );
};

export default HomePage;
