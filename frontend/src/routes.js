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
import BookDetailsList from './pages/BookDetailsList';
import BookDetailsForm from './components/book_details/BookDetailsForm';
import PaymentList from './pages/PaymentList';
import PaymentForm from './components/payment/PaymentForm';
import OrderList from './pages/OrderList';
import OrderDetailsList from './pages/OrderDetailsList';
import ReviewBookList from './pages/ReviewBookList';
import TotalRevenueList from './pages/TotalRevenueList';
import Profile from './components/profile';
import PublisherList from './pages/PublisherList';
import PublisherForm from './components/publisher/PublisherForm';

export const routesAdmin = () => [
  {
    path: '/admin',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'users', element: <UserList /> },
      { path: 'category', element: <Categorylist /> },
      { path: 'user-form', element: <UserForm /> },
      { path: 'category-form', element: <CategoryForm /> },
      { path: 'book', element: <BookList /> },
      { path: 'book-form', element: <BookForm /> },
      { path: 'book-details', element: <BookDetailsList /> },
      { path: 'book-details-form', element: <BookDetailsForm /> },
      { path: 'publisher', element: <PublisherList /> },
      { path: 'publisher-form', element: <PublisherForm /> },
      { path: 'payment', element: <PaymentList /> },
      { path: 'payment-form', element: <PaymentForm /> },
      { path: 'order', element: <OrderList /> },
      { path: 'orderdetails', element: <OrderDetailsList /> },
      { path: 'reviewbook', element: <ReviewBookList /> },
      { path: 'totalrevenue', element: <TotalRevenueList /> },
      { path: '/', element: <Navigate to="/dashboard" /> },
      // { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      // { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/admin/book" /> },
      // { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];
export const routesUser = () => [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'profile', element: <Profile /> },
      // { path: '/', element: <Navigate to="/dashboard" /> },
      { path: 'settings', element: <Settings /> },

    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      // { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/profile" /> },
      // { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];
export const routes = () => [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // { path: 'profile', element: <Profile /> },
      { path: 'login', element: <Login /> },
      // { path: 'register', element: <Register /> },
      // { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/login" /> },
      // { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

// export default routes;
