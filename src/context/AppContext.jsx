/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialCustomersData = [
  { id: 1, name: 'Ahmed Mohamed', email: 'ahmed@example.com', phone: '01001234567', status: 'Active', ordersCount: 5 },
  { id: 2, name: 'Sara Hassan', email: 'sara@example.com', phone: '01123456789', status: 'Active', ordersCount: 3 },
  { id: 3, name: 'Mahmoud Ali', email: 'mahmoud@example.com', phone: '01234567890', status: 'Inactive', ordersCount: 1 },
];

export const AppProvider = ({ children }) => {
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('customers_data') || localStorage.getItem('my-customers');
      return saved ? JSON.parse(saved) : initialCustomersData;
    } catch {
      return initialCustomersData;
    }
  });

  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('customers_data', JSON.stringify(customers));
      localStorage.setItem('my-customers', JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to sync customers:', e);
    }
  }, [customers]);

  return (
    <AppContext.Provider value={{ cart, setCart, customers, setCustomers }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};