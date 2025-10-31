import {
  Package,
  ShoppingCart,
  User,
  LogOut,
  Plus,
  Search,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
  apiUrl: string;
}

interface Listing {
  id: number;
  title: string;
  price: number;
  seller: string;
  category: string;
  image: string;
}

export function Dashboard({ userEmail, onLogout, apiUrl }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'myListings' | 'profile'>('browse');
  const [searchQuery, setSearchQuery] = useState('');

  // You would replace this with state populated by an API call
  const [listings, setListings] = useState<Listing[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);

  // This useEffect hook fetches data from protected routes when the component loads
  useEffect(() => {
    const fetchListings = async () => {
      const token = localStorage.getItem('gator_token');
      if (!token) {
        toast.error('You are not logged in.');
        onLogout();
        return;
      }

      try {
        // --- DO: Create and call a '/listings' endpoint ---
        // For now, we just use the mock data
        // const response = await fetch(`${apiUrl}/listings`, {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // });
        // if (!response.ok) throw new Error("Could not fetch listings");
        // const data = await response.json();
        // setListings(data);

        // Using mock data for now
        const mockListings: Listing[] = [
          { id: 1, title: 'Calculus Textbook', price: 45, seller: 'student1@ufl.edu', category: 'Textbooks', image: 'https://placehold.co/400x300/00306e/ffb362?text=Textbook' },
          { id: 2, title: 'Mini Fridge', price: 80, seller: 'student2@ufl.edu', category: 'Furniture', image: 'https://placehold.co/400x300/00306e/ffb362?text=Mini+Fridge' },
          { id: 3, title: 'Desk Lamp', price: 15, seller: 'student3@ufl.edu', category: 'Furniture', image: 'https://placehold.co/400x300/00306e/ffb362?text=Desk+Lamp' },
        ];
        setListings(mockListings);

        // --- DO: Create and call a '/my-listings' endpoint ---
        const myMockListings: Listing[] = [
           { id: 7, title: 'Biology Textbook', price: 40, seller: userEmail, category: 'Textbooks', image: 'https://placehold.co/400x300/ffb362/00306e?text=My+Book' },
        ];
        setMyListings(myMockListings);

      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load data");
        onLogout(); // Log out if token is bad
      }
    };

    fetchListings();
  }, [userEmail, apiUrl, onLogout]); // Re-run if these change

  const filteredListings = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddListing = () => {
    toast.info('Add listing feature would open a form');
  };

  const handleContactSeller = (seller: string) => {
    toast.success(`Contact initiated with ${seller}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#00306e] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-[#ffb362] rounded-full flex items-center justify-center">
                <ShoppingCart className="size-6" />
              </div>
              <h1 className="font-['Impact:Regular',_sans-serif] text-[32px]">
                GATOR MARKET
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-['Alumni_Sans:Regular',_sans-serif] text-[20px]">
                {userEmail}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-[#ffb362] hover:bg-[#ffa347] transition-colors px-4 py-2 rounded-full"
              >
                <LogOut className="size-4" />
                <span className="font-['Alumni_Sans:Regular',_sans-serif] text-[18px]">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-4 px-2 border-b-2 transition-colors font-['Alumni_Sans:Regular',_sans-serif] text-[22px] ${
                activeTab === 'browse'
                  ? 'border-[#ffb362] text-[#00306e]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Browse Listings
            </button>
            <button
              onClick={() => setActiveTab('myListings')}
              className={`py-4 px-2 border-b-2 transition-colors font-['Alumni_Sans:Regular',_sans-serif] text-[22px] ${
                activeTab === 'myListings'
                  ? 'border-[#ffb362] text-[#00306e]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Listings
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-2 border-b-2 transition-colors font-['Alumni_Sans:Regular',_sans-serif] text-[22px] ${
                activeTab === 'profile'
                  ? 'border-[#ffb362] text-[#00306e]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && (
          <div>
            <div className="mb-6 flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00306e] font-['Alumni_Sans:Regular',_sans-serif] text-[20px]"
                />
              </div>
              <button
                onClick={handleAddListing}
                className="bg-[#ffb362] hover:bg-[#ffa347] transition-colors px-6 py-3 rounded-lg flex items-center gap-2 text-white font-['Alumni_Sans:Regular',_sans-serif] text-[20px]"
              >
                <Plus className="size-5" />
                New Listing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x300?text=Image')}
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-['Impact:Regular',_sans-serif] text-[24px] text-[#00306e]">
                        {listing.title}
                      </h3>
                      <span className="font-['Impact:Regular',_sans-serif] text-[24px] text-[#ffb362]">
                        ${listing.price}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2 font-['Alumni_Sans:Regular',_sans-serif] text-[18px]">
                      {listing.category}
                    </p>
                    <p className="text-gray-500 mb-4 font-['Alumni_Sans:Regular',_sans-serif] text-[16px]">
                      Seller: {listing.seller}
                    </p>
                    <button
                      onClick={() => handleContactSeller(listing.seller)}
                      className="w-full bg-[#00306e] hover:bg-[#004080] transition-colors text-white py-2 rounded-lg font-['Alumni_Sans:Regular',_sans-serif] text-[18px]"
                    >
                      Contact Seller
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'myListings' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="font-['Impact:Regular',_sans-serif] text-[32px] text-[#00306e]">
                My Listings
              </h2>
              <button
                onClick={handleAddListing}
                className="bg-[#ffb362] hover:bg-[#ffa347] transition-colors px-6 py-3 rounded-lg flex items-center gap-2 text-white font-['Alumni_Sans:Regular',_sans-serif] text-[20px]"
              >
                <Plus className="size-5" />
                New Listing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x300?text=Image')}
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-['Impact:Regular',_sans-serif] text-[24px] text-[#00306e]">
                        {listing.title}
                      </h3>
                      <span className="font-['Impact:Regular',_sans-serif] text-[24px] text-[#ffb362]">
                        ${listing.price}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 font-['Alumni_Sans:Regular',_sans-serif] text-[18px]">
                      {listing.category}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          toast.info('Edit feature would open a form')
                        }
                        className="flex-1 bg-[#00306e] hover:bg-[#004080] transition-colors text-white py-2 rounded-lg font-['Alumni_Sans:Regular',_sans-serif] text-[18px]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toast.success('Listing deleted')}
                        className="flex-1 bg-red-600 hover:bg-red-700 transition-colors text-white py-2 rounded-lg font-['Alumni_Sans:Regular',_sans-serif] text-[18px]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="size-24 bg-[#00306e] rounded-full flex items-center justify-center">
                  <User className="size-12 text-white" />
                </div>
                <div>
                  <h2 className="font-['Impact:Regular',_sans-serif] text-[32px] text-[#00306e] mb-2">
                    My Profile
                  </h2>
                  <p className="font-['Alumni_Sans:Regular',_sans-serif] text-[20px] text-gray-600">
                    {userEmail}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-['Alumni_Sans:Regular',_sans-serif] text-[24px] text-[#00306e] mb-4">
                    Account Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="size-6 text-[#ffb362]" />
                        <span className="font-['Alumni_Sans:Regular',_sans-serif] text-[20px] text-gray-600">
                          Active Listings
                        </span>
                      </div>
                      <p className="font-['Impact:Regular',_sans-serif] text-[36px] text-[#00306e]">
                        {myListings.length}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <ShoppingCart className="size-6 text-[#ffb362]" />
                        <span className="font-['Alumni_Sans:Regular',_sans-serif] text-[20px] text-gray-600">
                          Total Sales
                        </span>
                      </div>
                      <p className="font-['Impact:Regular',_sans-serif] text-[36px] text-[#00306e]">
                        0
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-['Alumni_Sans:Regular',_sans-serif] text-[24px] text-[#00306e] mb-4">
                    Account Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => toast.info('Edit profile feature')}
                      className="w-full bg-[#00306e] hover:bg-[#004080] transition-colors text-white py-3 rounded-lg font-['Alumni_Sans:Regular',_sans-serif] text-[20px]"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => toast.info('Change password feature')}
                      className="w-full bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 py-3 rounded-lg font-['Alumni_Sans:Regular',_sans-serif] text-[20px]"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

