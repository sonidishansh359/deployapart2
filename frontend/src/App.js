import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    try {
      const response = await axios.post(` https://deployapart2-backend.onrender.com/api/auth${endpoint}`, {
        username,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed`);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
  };

  return (
    <div className="App">
      <div className="login-container">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button type="button" onClick={toggleMode} className="toggle-btn">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;
