import './globals.css';
import React, { ReactNode } from 'react';

export default function RootLayout ({
  children,
  modal
}: any) {

  return (
    <html lang="en">
    <body>
    {children}
    {modal}
    </body>
    </html>
  );
}

