// src/RegisterPage.js
import React, { useState } from 'react';
import Login, { Email, Password, Submit, ButtonAfter, Title } from '@react-login-page/page3';
import defaultBannerImage from '@react-login-page/page3/bg.jpeg';
import { useAuth } from './AuthContext';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();  // Ensure there is a 'register' function in your AuthContext

  return (
    <Login style={{ height: 'auto', width: 'auto' }}>
      <Login.Banner style={{ backgroundImage: `url(${defaultBannerImage})` }} />
      <Title>Welcome! Register for an account.</Title>
      <Email
        label="Email:"
        placeholder="Enter your email"
        onChange={e => setEmail(e.target.value)}
      />
      <Email
        rename="username"
        label="Username:"
        placeholder="Choose a username"
        onChange={e => setUsername(e.target.value)}
      />
      <Password
        placeholder="Enter your password"
        onChange={e => setPassword(e.target.value)}
      />
      <Submit onClick={() => register(email, username, password)} text="Register" />
      <ButtonAfter>
        Already registered? <a href="/login">Log in</a>
      </ButtonAfter>
    </Login>
  );
};

export default RegisterPage;
