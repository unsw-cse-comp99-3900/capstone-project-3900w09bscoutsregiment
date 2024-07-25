// context/ThemeContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        console.log("about to access the document");
        // Check localStorage for the theme on component mount
        const storedTheme = localStorage.getItem("theme") || "light";
        setTheme(storedTheme);
        console.log("about t0pppppppppp");
        console.log(document.documentElement.className);
        document.documentElement.className = storedTheme;
    }, []);

    const toggleTheme = (newTheme) => {
        console.log(newTheme);
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.className = newTheme;
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
