import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './styles/index.scss';
import ProtectedRoute from './components/Layout';
import ErrorPage from './pages/ErrorPage';
import TablePage from './pages/TablePage';
import Register from './pages/Register';
import Login from './pages/Login';
import Cookies from 'js-cookie'; 

const getAccessToken = () => {
  return Cookies.get('access_token_cookie') || localStorage.getItem('Token');
}

const isAuthenticated = () => {
  return !!getAccessToken();
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    index: true
  },
    {
    path: '/login',
    element: <Login />,
    index: true
  },
  {
    path: '/register',
    element: <Register />,
    index: true
  },
  {
    element: <ProtectedRoute isAuthenticated={isAuthenticated()} />,
    children: [
      {
        path: `users/${localStorage.getItem('user_id')}/dashboard`,
        element: <TablePage />
      }    
    ]
  },
  {
    path: '*',
    element: <ErrorPage />
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);