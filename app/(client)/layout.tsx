import React from 'react';
import './layout.css';

export default async function ({ children }: any) {
  return (
    <div className="ossl">
      {children}
    </div>
  );
}