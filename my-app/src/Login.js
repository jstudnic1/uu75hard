// src/Login.js
import React, { useState } from 'react';
import Login from '@react-login-page/page3';
import defaultBannerImage from '@react-login-page/page3/bg.jpeg';
import { useAuth } from './AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  return (
    <Login style={{ height: 580 }}>
      <Login.Banner style={{ backgroundImage: `url(${defaultBannerImage})` }} />
      <Login.Email
        label="Username:"
        placeholder="Enter your username"
        onChange={e => setEmail(e.target.value)}
      />
      <Login.Password
        placeholder="Enter your password"
        onChange={e => setPassword(e.target.value)}
      />
      <Login.Submit onClick={() => login(email, password)} />
      <Login.ButtonAfter>
       register here  <a href="/register">Register</a>
      </Login.ButtonAfter>
    </Login>
  );
};

export default LoginPage;
