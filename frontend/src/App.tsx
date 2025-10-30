import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Dashboard } from './components/Dashboard';

type Page = 'login' | 'register' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  const handleLogin = (email: string) => {
    setLoggedInUser(email);
    setCurrentPage('dashboard');
  };

  const handleRegister = (email: string) => {
    setLoggedInUser(email);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
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
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage 
          onRegister={handleRegister}
          onNavigateToLogin={navigateToLogin}
        />
      )}
      {currentPage === 'dashboard' && loggedInUser && (
        <Dashboard 
          userEmail={loggedInUser}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
