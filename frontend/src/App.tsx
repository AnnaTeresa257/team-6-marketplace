import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Dashboard } from './components/Dashboard';
import { ProfilePage } from './components/ProfilePage';

type Page = 'login' | 'register' | 'dashboard' | 'profile';

//  MOCK MODE: Set to false when backend is running
const MOCK_MODE = true;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const apiUrl = 'http://localhost:8000';

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

  const navigateToProfile = () => {
    setCurrentPage('profile');
  };

  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin} 
          onNavigateToRegister={navigateToRegister}
          apiUrl={apiUrl}
          mockMode={MOCK_MODE}
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage 
          onRegister={handleRegister}
          onNavigateToLogin={navigateToLogin}
          apiUrl={apiUrl}
          mockMode={MOCK_MODE}
        />
      )}
      {currentPage === 'dashboard' && loggedInUser && (
        <Dashboard 
          userEmail={loggedInUser}
          onLogout={handleLogout}
          onNavigateToProfile={navigateToProfile}
        />
      )}
      {currentPage === 'profile' && loggedInUser && (
        <ProfilePage
          userEmail={loggedInUser}
          onNavigateToDashboard={navigateToDashboard}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}