import { createRoot } from 'react-dom/client';
import App from './App';
import './main.css';
import { StrictMode } from 'react';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);