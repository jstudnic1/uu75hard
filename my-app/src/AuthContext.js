import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already navigated to home to prevent unnecessary navigation
    const shouldNavigateHome = user && !localStorage.getItem('navigated');
    if (shouldNavigateHome) {
      localStorage.setItem('navigated', 'true'); // Set a flag to avoid repetitive navigation
      navigate('/home');
    }
    return () => {
      if (!user) localStorage.removeItem('navigated'); // Clean up on logout
    };
  }, [user, navigate]);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      const tasks = await fetchTasks(data.userId); // Fetch tasks after logging in
      const userData = { ...data, tasks: tasks };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  const addTask = async (taskName) => {
    if (!user || !user.userId) {
      console.error("User ID is undefined, can't add task");
      return;
    }
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const taskId = `${today}-${user.userId}`;
    try {
      const response = await fetch(`http://localhost:3000/task/${taskId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: taskName })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add task");
      }
      const addedTask = await response.json();
      setUser(prevUser => {
        const updatedTasks = [...prevUser.tasks, addedTask];
        localStorage.setItem('user', JSON.stringify({...prevUser, tasks: updatedTasks}));
        return {...prevUser, tasks: updatedTasks};
      });
    } catch (error) {
      console.error('Add task error:', error.message);
    }
  };

  const deleteTask = async (taskName) => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const fullTaskId = `${today}-${user.userId}`;
    try {
      const response = await fetch(`http://localhost:3000/task/${fullTaskId}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name: taskName })
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setUser(prevUser => {
        const updatedTasks = prevUser.tasks.filter(task => task.name !== taskName);
        localStorage.setItem('user', JSON.stringify({...prevUser, tasks: updatedTasks}));
        return {...prevUser, tasks: updatedTasks};
      });
    } catch (error) {
      console.error('Delete task error:', error);
    }
  };

  const fetchTasks = async (userId) => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const taskId = `${today}-${userId}`;
    try {
      const response = await fetch(`http://localhost:3000/task/get?id=${taskId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      return data.tasks || [];
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      return [];
    }
  };

  const markTaskAsDone = async (taskName) => {
	if (!user || !user.userId) {
	  console.error("User ID is undefined, can't mark task as done");
	  return;
	}
	const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
	const taskId = `${today}-${user.userId}`;

	try {
	  const response = await fetch(`http://localhost:3000/task/${taskId}/markAsDone`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name: taskName })
	  });
	  if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Failed to mark task as done");
	  }

	  setUser(prevUser => {
		const updatedTasks = prevUser.tasks.map(task =>
		  task.name === taskName ? { ...task, completed: true } : task
		);
		localStorage.setItem('user', JSON.stringify({...prevUser, tasks: updatedTasks}));
		return {...prevUser, tasks: updatedTasks};
	  });
	} catch (error) {
	  console.error('Mark task as done error:', error.message);
	}
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('navigated'); // Remove the navigation flag on logout
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, addTask, deleteTask, markTaskAsDone }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
