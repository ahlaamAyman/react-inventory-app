import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/bodyComponents/Home";
import RootComponent from "./components/RootComponent";
import Inventory from "./components/bodyComponents/Inventory";
import Customers from "./components/bodyComponents/Customers";
import toast, {Toaster} from 'react-hot-toast';
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import POS from "./pages/POS";
import SalesHistory from "./pages/SalesHistory";
import Growth from "./pages/Growth";
import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useEffect } from "react";
import { logout } from "./store/authSlice";
import { loadData, saveData } from "./utils/localStorageUtils";
import { fetchProducts, setSalesHistory } from "./store/inventorySlice";
import Settings from "./pages/Settings";

function App() {
  const dispatch = useDispatch();
  const { salesHistory, items } = useSelector((state) => state.inventory);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (items.length === 0) { // اسحب من الـ API بس لو المخزن فاضي أول مرة
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  const FloatingThemeToggle=()=>{
    const {darkMode,toggleDarkMode}=useTheme();
    return (
      <button onClick={toggleDarkMode} className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-700 p-3 rounded-full shadow-lg">
        {darkMode ? <i className="fas fa-sun text-yellow-500"></i> : <i className="fas fa-moon text-gray-800"></i>}
      </button>
    );
  }

  useEffect(() => {
    const savedSalesHistory = loadData("sales-history");
    if (savedSalesHistory) {
      dispatch(setSalesHistory(savedSalesHistory));
    }
  }, [dispatch]);

  useEffect(() => {
    if (salesHistory.length > 0) {
      saveData("sales-history", salesHistory);
    }
  }, [salesHistory]);

  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime) {
        const currentTime = new Date().getTime();
        const oneHour = 1 * 60 * 60 * 1000; 

        if (currentTime - loginTime > oneHour) {
          dispatch(logout());
          toast.success("Session expired. Please log in again.");
        }
      }
    };

    const timer = setInterval(checkSession, 60000); 
    return () => clearInterval(timer);
  }, [dispatch]);

  const router = createBrowserRouter([
 
    {
      path: "/login",
      element: !isAuthenticated ? <Login /> : <Navigate to="/" />,
    },
    {
      path: "/signup",
      element: !isAuthenticated ? <SignUp /> : <Navigate to="/" />,
    },

    {
      path: "/",
      element: isAuthenticated ? <RootComponent /> : <Navigate to="/login" />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "inventory", element: <Inventory /> },
        { path: "pos", element: <POS /> },
        { path: "history", element: <SalesHistory /> },
        { path: "growth", element: <Growth /> },
        { path: "settings", element: <Settings /> },

        { path: "customers", element: <Customers /> },
      ],
    },
  ]);




  return (
    <>
    <ThemeProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <FloatingThemeToggle/>
      <RouterProvider router={router} />
    </ThemeProvider>

    </>
  );
}

export default App;
