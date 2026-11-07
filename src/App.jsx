import { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';

import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import RootComponent from './components/RootComponent';
import Dashboard from './components/bodyComponents/Home';
import Inventory from './components/bodyComponents/Inventory';
import Customers from './components/bodyComponents/Customers';
import POS from './pages/POS';
import SalesHistory from './pages/SalesHistory';
import Growth from './pages/Growth';
import Settings from './pages/Settings';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import { logout } from './store/authSlice';
import { fetchProducts } from './store/inventorySlice';

// Authenticated guard layout
const ProtectedLayout = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <RootComponent /> : <Navigate to="/login" replace />;
};

// Guest-only guard layout
const GuestLayout = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

// Router created ONCE at module level (not inside App component)
const router = createBrowserRouter([
  {
    element: <GuestLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <SignUp /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'customers', element: <Customers /> },
      { path: 'pos', element: <POS /> },
      { path: 'history', element: <SalesHistory /> },
      { path: 'growth', element: <Growth /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.inventory);

  // Bootstrap products if store is empty on initial launch
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  // Session timeout watchdog (1 hour expiry)
  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime) {
        const currentTime = Date.now();
        const oneHour = 60 * 60 * 1000;
        if (currentTime - Number(loginTime) > oneHour) {
          dispatch(logout());
          toast.error('Session expired. Please log in again.');
        }
      }
    };

    checkSession();
    const timer = setInterval(checkSession, 60000);
    return () => clearInterval(timer);
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
