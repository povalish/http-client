import React, { useState } from 'react';
import './App.scss';



type LoginData = {
  email: string;
  password: string;
}

export const App: React.FC = () => {
  const login = () => {
  };

  return (
    <section className='page wide--child wide--parent'>
      <button type='button' onClick={() => login()}>Make request call (axios)</button>
    </section>
  );
};
