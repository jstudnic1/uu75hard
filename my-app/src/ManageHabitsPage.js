import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';
import './taskCards.css';

const ManageHabitsPage = () => {
  const { user, deleteTask } = useAuth();

  useEffect(() => {
    console.log("Manage Habits Page Loaded");
    return () => console.log("Manage Habits Page Unloaded");
  }, []);

  const handleDeleteTask = async (taskId) => {
    console.log(`Deleting task with ID: ${taskId}`);
    await deleteTask(taskId);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="content flex-1 p-4">
        <h2>Manage Your Habits:</h2>
        {user && user.tasks && user.tasks.length > 0 ? (
          <div className="grid gap-4">
            {user.tasks.map((task) => (
              <div key={task.taskId} className="card bg-base-200 shadow-xl p-4 flex justify-between items-center">
                <span>{task.name} - {task.completed ? 'Completed' : 'Pending'}</span>
                <button className="btn btn-error" onClick={() => handleDeleteTask(task.name)}>Delete</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No habits to manage right now.</p>
        )}
      </div>
    </div>
  );
};

export default ManageHabitsPage;
