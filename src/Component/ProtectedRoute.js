import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/check`, { withCredentials: true });
                setIsAuthenticated(response.data.authenticated);
            } catch (error) {
                console.error("Auth check failed:", error); // Log the error for debugging
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Optionally show a loading state
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children;
};
export default ProtectedRoute;
