"use client";

import { useEffect } from "react";

/**
 * ThemeInitializer - Applies the saved theme on every page load
 * This ensures dark mode persists across all pages, even those without Footer
 */
const ThemeInitializer = () => {
    useEffect(() => {
        // Get saved theme from localStorage, default to 'dark'
        const savedTheme = localStorage.getItem("theme") || "dark";
        const savedViewMode = localStorage.getItem("view") || "ltr";

        // Apply theme to document
        document.documentElement.setAttribute("theme-color", savedTheme);
        document.documentElement.setAttribute("view-mode", savedViewMode);
    }, []);

    return null; // This component doesn't render anything
};

export default ThemeInitializer;
