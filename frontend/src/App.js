import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function BotPage({ username, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate bot response (replace with actual AI API call)
    setTimeout(() => {
      const botMessage = { text: `Hello ${username}, you said: "${userMessage.text}". I'm a powerful ultra bot!`, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="bot-page">
      <header className="bot-header">
        <h1>Welcome, {username}!</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    try {
      const response = await axios.post(`http://localhost:5000/api/auth${endpoint}`, {
        username,
        password,
      });
      setMessage(response.data.message);
      if (isLogin && response.data.message === 'Login successful') {
        setLoggedInUser(username);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed`);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUsername('');
    setPassword('');
    setMessage('');
  };

  if (loggedInUser) {
    return <BotPage username={loggedInUser} onLogout={handleLogout} />;
  }

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
