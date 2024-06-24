import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { EmailProvider } from './EmailContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <EmailProvider>
    <App />
    </EmailProvider>
  </React.StrictMode>
);
