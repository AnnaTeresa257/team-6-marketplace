import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // This will correctly import App.tsx
import reportWebVitals from './reportWebVitals';
import { Toaster } from 'sonner'; // <-- Import Toaster
import "@fontsource/alumni-sans"; 


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Toaster richColors position="top-center" /> {/* <-- Add Toaster component */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

