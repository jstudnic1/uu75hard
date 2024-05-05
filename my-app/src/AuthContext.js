import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      navigate('/home');
    }
  }, [navigate]);

  const login = async (username, password) => {
    try {
      const loginResponse = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const loginData = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginData.message);

      const userData = {
        ...loginData,
        tasks: await fetchTasks(loginData.userId) // Fetch tasks immediately after login
      };

      localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage
      setUser(userData);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  const addTask = async (taskName) => {
    if (!user || !user.id) {
      console.error("User ID is undefined, can't add task");
      return;
    }

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const taskId = `${today}-${user.id}`;

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

      setUser(prevUser => ({
        ...prevUser,
        tasks: [...prevUser.tasks, addedTask]
      }));

      console.log("Task added successfully:", addedTask);
      return addedTask;
    } catch (error) {
      console.error('Add task error:', error.message);
      return null;
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
      const { tasks } = await response.json();
      return tasks || [];
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      return [];
    }
  };

  const logout = () => {
    localStorage.removeItem('user'); // Remove user data from localStorage
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, addTask }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
