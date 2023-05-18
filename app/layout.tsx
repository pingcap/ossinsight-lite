import './globals.css';
import React from 'react';
import App from '@/src/App';

export default function RootLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body>
    <App>
      {children}
    </App>
    </body>
    </html>
  );
}

