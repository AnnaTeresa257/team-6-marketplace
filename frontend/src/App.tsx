import { useState, useEffect, useCallback } from 'react';
// Add .tsx extension to help the build system resolve the files
import { LoginPage } from './components/LoginPage.tsx';
import { RegisterPage } from './components/RegisterPage.tsx';
import { Dashboard } from './components/Dashboard.tsx';

type Page = 'login' | 'register' | 'dashboard';

// This is the base URL of your FastAPI backend
const API_URL = 'http://127.0.0.1:8000';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  // This function checks if a token is valid
  const validateToken = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/secure-data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Token is invalid');
      }
      const user = await response.json();
      // Set the user's email from the token/secure data
      setLoggedInUser(user.email);
      setCurrentPage('dashboard');
    } catch (error) {
      // If token is invalid, remove it and stay on login page
      localStorage.removeItem('gator_token');
      setLoggedInUser(null);
      setCurrentPage('login');
    }
  }, []);

  // On initial app load, check for an existing token
  useEffect(() => {
    const token = localStorage.getItem('gator_token');
    if (token) {
      validateToken(token);
    }
  }, [validateToken]);

  // This is called by LoginPage on successful login
  const handleLogin = (email: string) => {
    setLoggedInUser(email);
    setCurrentPage('dashboard');
  };

  // This is called by RegisterPage on successful registration
  const handleRegister = () => {
    // After registering, send user to login
    setCurrentPage('login');
  };

  // This is called by Dashboard to log out
  const handleLogout = () => {
    localStorage.removeItem('gator_token'); // Clear the token
    setLoggedInUser(null);
    setCurrentPage('login');
  };

  const navigateToRegister = () => {
    setCurrentPage('register');
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onNavigateToRegister={navigateToRegister}
          apiUrl={API_URL}
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage
          onRegister={handleRegister}
          onNavigateToLogin={navigateToLogin}
          apiUrl={API_URL}
        />
      )}
      {currentPage === 'dashboard' && loggedInUser && (
        <Dashboard
          userEmail={loggedInUser}
          onLogout={handleLogout}
          apiUrl={API_URL}
        />
      )}
    </>
  );
}

