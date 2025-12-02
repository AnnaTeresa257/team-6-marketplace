import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Dashboard } from './components/Dashboard';
import { ProfilePage } from './components/ProfilePage';
import { ListingDetailPage } from './components/ListingDetailPage';

type Page = 'login' | 'register' | 'dashboard' | 'profile' | 'listingDetail';

interface Listing {
  id: number;
  title: string;
  price: number;
  seller: string;
  category: string;
  image: string;
  isSold?: boolean;
}

//  MOCK MODE: Set to false when backend is running
const MOCK_MODE = true;

// Admin emails for mock mode (in production this would come from the backend)
const MOCK_ADMIN_EMAILS = ['admin@ufl.edu'];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const apiUrl = 'http://localhost:8000';

  const handleLogin = (email: string, adminStatus?: boolean) => {
    setLoggedInUser(email);
    // In mock mode, check if the email is in the admin list
    // In API mode, adminStatus would come from the backend
    if (MOCK_MODE) {
      setIsAdmin(MOCK_ADMIN_EMAILS.includes(email));
    } else {
      setIsAdmin(adminStatus || false);
    }
    setCurrentPage('dashboard');
  };

  const handleRegister = (email: string) => {
    setLoggedInUser(email);
    // New registrations are not admins
    setIsAdmin(false);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setIsAdmin(false);
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

  const navigateToListingDetail = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentPage('listingDetail');
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
          onNavigateToListingDetail={navigateToListingDetail}
          apiUrl={apiUrl}
          mockMode={MOCK_MODE}
          isAdmin={isAdmin}
        />
      )}
      {currentPage === 'profile' && loggedInUser && (
        <ProfilePage
          userEmail={loggedInUser}
          onNavigateToDashboard={navigateToDashboard}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'listingDetail' && loggedInUser && selectedListing && (
        <ListingDetailPage
          listing={selectedListing}
          onNavigateBack={navigateToDashboard}
        />
      )}
    </>
  );
}