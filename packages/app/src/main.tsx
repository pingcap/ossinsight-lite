import './router';
import { createRoot } from 'react-dom/client';
// import { StrictMode } from 'react';
import { RouterProvider } from 'react-router';
import router from './router';
import './index.css'

createRoot(document.getElementById('app')!)
  .render(
    // <StrictMode>
      <RouterProvider router={router} />
    // </StrictMode>,
  );
