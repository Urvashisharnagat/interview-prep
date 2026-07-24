import React from 'react';
import { RouterProvider } from 'react-router-dom'; // 👈 'react-router' ko 'react-router-dom' kar do
import { router } from './App.routes.jsx';
import { AuthProvider } from './features/auth/auth.context.jsx';
import { InterviewProvider } from './features/interview/Interview.context.jsx';

export const App = () => {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router}/>
      </InterviewProvider>
    </AuthProvider>
  );
};