import { Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import Account from './pages/Account';
import UserList from './pages/UserList';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Settings from './pages/Settings';
import UserForm from './components/user/UserForm';
import CategoryForm from './components/category/CategoryForm';
import Categorylist from './pages/Categorylist';
import BookList from './pages/BookList';
import BookForm from './components/book/BookForm';
import PaymentList from './pages/PaymentList';
import PaymentForm from './components/payment/PaymentForm';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'users', element: <UserList /> },
      { path: 'category', element: <Categorylist /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'user-form', element: <UserForm /> },
      { path: 'category-form', element: <CategoryForm /> },
      { path: 'book', element: <BookList /> },
      { path: 'book-form', element: <BookForm /> },
      { path: 'payment', element: <PaymentList /> },
      { path: 'payment-form', element: <PaymentForm /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
