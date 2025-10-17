import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Stockfish } from 'stockfish.js';
import './App.css';

function BotPage({ username, onLogout }) {
  const [game, setGame] = useState(new Chess());
  const [stockfish, setStockfish] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isPlayingChess, setIsPlayingChess] = useState(false);

  useEffect(() => {
    const sf = new Stockfish();
    sf.addMessageListener((line) => {
      if (line.startsWith('bestmove')) {
        const move = line.split(' ')[1];
        if (move && move !== '(none)') {
          makeBotMove(move);
        }
      }
    });
    setStockfish(sf);
    return () => sf.terminate();
  }, []);

  const makeBotMove = (move) => {
    const gameCopy = { ...game };
    const result = gameCopy.move(move, { sloppy: true });
    if (result) {
      setGame(gameCopy);
      setMessages(prev => [...prev, { text: `Bot played: ${result.san}`, sender: 'bot' }]);
    }
  };

  const onDrop = (sourceSquare, targetSquare) => {
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    if (move === null) return false; // illegal move

    setGame(gameCopy);
    setMessages(prev => [...prev, { text: `You played: ${move.san}`, sender: 'user' }]);

    // Make bot move
    if (stockfish) {
      stockfish.postMessage(`position fen ${gameCopy.fen()}`);
      stockfish.postMessage('go movetime 1000');
    }

    return true;
  };

  const startChess = () => {
    setIsPlayingChess(true);
    setMessages([{ text: 'Chess game started! You are white. Make your move.', sender: 'bot' }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      let botResponse = `Hello ${username}, you said: "${userMessage.text}". I'm a powerful ultra bot!`;
      if (userMessage.text.toLowerCase().includes('chess')) {
        botResponse += ' Would you like to play chess?';
      }
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  return (
    <div className="bot-page">
      <header className="bot-header">
        <h1>Welcome, {username}!</h1>
        <div>
          {!isPlayingChess && <button onClick={startChess} className="chess-btn">Play Chess</button>}
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      <div className="content-container">
        {isPlayingChess ? (
          <div className="chess-container">
            <Chessboard position={game.fen()} onPieceDrop={onDrop} />
            <div className="game-status">
              <p>{game.isCheckmate() ? 'Checkmate!' : game.isStalemate() ? 'Stalemate!' : game.isDraw() ? 'Draw!' : `Turn: ${game.turn() === 'w' ? 'White' : 'Black'}`}</p>
            </div>
          </div>
        ) : (
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
        )}
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
