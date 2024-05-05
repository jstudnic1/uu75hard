import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar'; // Import the Sidebar component
import './taskCards.css';

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

  const handleMarkAsDone = (taskId) => {
    // This function could call an API to update the task status
    console.log(`Mark task ${taskId} as done`);
    // Update the task status in your local state or refetch tasks
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="content flex-1 p-4">
        <h2>Tasks for Today:</h2>
        {tasks.length > 0 ? (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div key={task.taskId} className="card bg-base-200 shadow-xl p-4 flex justify-between items-center">
                <span>{task.name} - {task.completed ? 'Done' : 'Pending'}</span>
                <button className="btn btn-success" onClick={() => handleMarkAsDone(task.taskId)}>Done</button>
              </div>
            ))}
          </div>
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
