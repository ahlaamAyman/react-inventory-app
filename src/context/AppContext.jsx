import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

const [customers, setCustomers] = useState(() => {
    const savedCustomers = localStorage.getItem('customers_data');
    return savedCustomers ? JSON.parse(savedCustomers) : [];
});

useEffect(() => {
    localStorage.setItem('customers_data', JSON.stringify(customers));
}, [customers]);

    const [cart, setCart] = useState([]);

    return (
        <AppContext.Provider value={{ cart, setCart, customers, setCustomers }}>
            {children}
        </AppContext.Provider>
    );
};