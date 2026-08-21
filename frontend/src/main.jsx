import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

// import.meta.env.BASE_URL is set by Vite at build time:
//   - local dev:          '/'
//   - GitHub Pages build: '/CartNova-Full-Stack-E-Commerce/'
// Passing it as `basename` tells React Router to strip that prefix
// before matching routes, so '/' still maps to ProductsPage, etc.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
