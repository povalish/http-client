import React, { useState } from 'react';
import './App.scss';



type LoginData = {
  email: string;
  password: string;
}

export const App: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const login = () => {
    const loginData: LoginData = {
      email: 'nikita.povalishev@skltech.ru',
      password: 'e4ks6G7r1',
    };
  };

  return (
    <section className='page wide--child wide--parent'>
      <button type='button' onClick={() => login()}>Make request call (axios)</button>

      {isSuccess && (
        <span>Success request</span>
      )}
    </section>
  );
};
