import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

 export const ThemeProvider = ({ children }) => {
    // Check localStorage on init, default to false if not set
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    });
    const toggleDarkMode = () => setDarkMode(!darkMode);

    // Apply theme class to html element
    useEffect(() => {
        if(darkMode){
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );

}
export const useTheme = () => useContext(ThemeContext);
