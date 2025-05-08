import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Clear localStorage to prevent automatic login
// Comment this out when you want to stay logged in
localStorage.removeItem('authToken');
localStorage.removeItem('user');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
