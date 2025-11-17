import { Package, ShoppingCart, User, LogOut, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import styles from './Dashboard.module.css';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
  onNavigateToProfile: () => void;
}

interface Listing {
  id: number;
  title: string;
  price: number;
  seller: string;
  category: string;
  image: string;
}

type Category = 'all' | 'school' | 'apparel' | 'living' | 'services' | 'tickets';

export function Dashboard({ userEmail, onLogout, onNavigateToProfile }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'myListings' | 'profile'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'category'>('name');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const mockListings: Listing[] = [
    { id: 1, title: 'Calculus Textbook', price: 45, seller: 'student1@ufl.edu', category: 'school', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400' },
    { id: 2, title: 'Mini Fridge', price: 80, seller: 'student2@ufl.edu', category: 'living', image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400' },
    { id: 3, title: 'Desk Lamp', price: 15, seller: 'student3@ufl.edu', category: 'living', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
    { id: 4, title: 'UF T-Shirt', price: 20, seller: 'student4@ufl.edu', category: 'apparel', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { id: 5, title: 'Gators Hoodie', price: 35, seller: 'student5@ufl.edu', category: 'apparel', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400' },
    { id: 6, title: 'Graphing Calculator', price: 60, seller: 'student6@ufl.edu', category: 'school', image: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400' },
    { id: 9, title: 'Tutoring - Calculus', price: 25, seller: 'student7@ufl.edu', category: 'services', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400' },
    { id: 10, title: 'Football Game Tickets', price: 50, seller: 'student8@ufl.edu', category: 'tickets', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400' },
    { id: 11, title: 'Study Desk', price: 65, seller: 'student9@ufl.edu', category: 'living', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400' },
    { id: 12, title: 'Basketball Game Tickets', price: 30, seller: 'student10@ufl.edu', category: 'tickets', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400' },
  ];

  const myListings: Listing[] = [
    { id: 7, title: 'Biology Textbook', price: 40, seller: userEmail, category: 'school', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400' },
    { id: 8, title: 'Office Chair', price: 50, seller: userEmail, category: 'living', image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400' },
  ];

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortListings = (listings: Listing[]) => {
    const sorted = [...listings];
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'category':
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return sorted;
    }
  };

  const sortedListings = sortListings(filteredListings);

  const handleAddListing = () => {
    toast.info('Add listing feature would open a form');
  };

  const handleContactSeller = (seller: string) => {
    toast.success(`Contact initiated with ${seller}`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <ShoppingCart className="size-8 text-[#00306e]" />
            </div>
            <h1 className={styles.logoText}>GATOR<br/>MARKETPLACE</h1>
          </div>
          <nav className={styles.nav}>
            <button
              onClick={() => setActiveTab('browse')}
              className={`${styles.navButton} ${activeTab === 'browse' ? styles.active : ''}`}
            >
              LIST
            </button>
            <button
              className={styles.navButton}
              onClick={() => toast.info('Cart feature coming soon')}
            >
              CART
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`${styles.navButton} ${activeTab === 'profile' ? styles.active : ''}`}
            >
              PROFILE
            </button>
            <button
              onClick={onLogout}
              className={styles.logoutButton}
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {activeTab === 'browse' && (
          <div>
            {/* Category Section */}
            <div className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>BROWSE BY CATEGORY</h2>
              
              {/* Category Circles */}
              <div className={styles.categoryCircles}>
                <div className={styles.categoryItem} onClick={() => setSelectedCategory('school')}>
                  <div className={`${styles.categoryCircle} ${selectedCategory === 'school' ? styles.active : ''}`}>
                    <img
                      src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200"
                      alt="School"
                      className={styles.categoryCircleImg}
                    />
                  </div>
                  <span className={styles.categoryLabel}>SCHOOL</span>
                </div>

                <div className={styles.categoryItem} onClick={() => setSelectedCategory('apparel')}>
                  <div className={`${styles.categoryCircle} ${styles.placeholder} ${selectedCategory === 'apparel' ? styles.active : ''}`}></div>
                  <span className={styles.categoryLabel}>APPAREL</span>
                </div>

                <div className={styles.categoryItem} onClick={() => setSelectedCategory('living')}>
                  <div className={`${styles.categoryCircle} ${styles.placeholder} ${selectedCategory === 'living' ? styles.active : ''}`}></div>
                  <span className={styles.categoryLabel}>LIVING</span>
                </div>

                <div className={styles.categoryItem} onClick={() => setSelectedCategory('services')}>
                  <div className={`${styles.categoryCircle} ${selectedCategory === 'services' ? styles.active : ''}`}>
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200"
                      alt="Services"
                      className={styles.categoryCircleImg}
                    />
                  </div>
                  <span className={styles.categoryLabel}>SERVICES</span>
                </div>

                <div className={styles.categoryItem} onClick={() => setSelectedCategory('tickets')}>
                  <div className={`${styles.categoryCircle} ${styles.placeholder} ${selectedCategory === 'tickets' ? styles.active : ''}`}></div>
                  <span className={styles.categoryLabel}>TICKETS</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionBar}>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={styles.showAllButton}
                >
                  Show All Categories
                </button>
                <div className={styles.actionButtons}>
                  <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className={styles.sortSelect}
                  >
                    <option value="name">Sort by: Name</option>
                    <option value="price-low">Sort by: Price (Low to High)</option>
                    <option value="price-high">Sort by: Price (High to Low)</option>
                    <option value="category">Sort by: Category</option>
                  </select>
                  <button
                    onClick={handleAddListing}
                    className={styles.newListingButton}
                  >
                    <Plus className="size-5" />
                    New Listing
                  </button>
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            <div className={styles.listingsGrid}>{sortedListings.map((listing) => (
                <div key={listing.id} className={styles.listingCard}>
                  <div className={styles.listingImage}>
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className={styles.listingImageImg}
                      onError={(e) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          e.currentTarget.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = styles.listingImagePlaceholder;
                          placeholder.textContent = 'Image';
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  </div>
                  <div className={styles.listingContent}>
                    <div className={styles.listingHeader}>
                      <div className={styles.listingInfo}>
                        <h3 className={styles.listingTitle}>{listing.title}</h3>
                        <p className={styles.listingCategory}>{listing.category}</p>
                      </div>
                      <span className={styles.listingPrice}>${listing.price}</span>
                    </div>
                    <button
                      onClick={() => handleContactSeller(listing.seller)}
                      className={styles.seeListingButton}
                    >
                      See Listing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'myListings' && (
          <div>
            <div className={styles.actionBar}>
              <h2 className={styles.pageTitle}>MY LISTINGS</h2>
              <button
                onClick={handleAddListing}
                className={styles.newListingButton}
              >
                <Plus className="size-5" />
                New Listing
              </button>
            </div>

            <div className={styles.listingsGrid}>
              {myListings.map((listing) => (
                <div key={listing.id} className={styles.listingCard}>
                  <div className={styles.listingImage}>
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className={styles.listingImageImg}
                    />
                  </div>
                  <div className={styles.listingContent}>
                    <div className={styles.listingHeader}>
                      <div className={styles.listingInfo}>
                        <h3 className={styles.listingTitle}>{listing.title}</h3>
                        <p className={styles.listingCategory}>{listing.category}</p>
                      </div>
                      <span className={styles.listingPrice}>${listing.price}</span>
                    </div>
                    <div className={styles.buttonGroup}>
                      <button
                        onClick={() => toast.info('Edit feature would open a form')}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toast.success('Listing deleted')}
                        className={styles.deleteButton}
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
          <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.profileIcon}>
                  <User className="size-12 text-white" />
                </div>
                <h2 className={styles.profileTitle}>View Full Profile</h2>
                <p className={styles.profileEmail}>{userEmail}</p>
                <button
                  onClick={onNavigateToProfile}
                  className={styles.profileButton}
                >
                  Go to Profile Page
                </button>
              </div>

              <div className={styles.statsSection}>
                <h3 className={styles.statsTitle}>Quick Stats</h3>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <Package className="size-6 text-[#ffb362]" />
                      <span className={styles.statLabel}>Active Listings</span>
                    </div>
                    <p className={styles.statValue}>{myListings.length}</p>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <ShoppingCart className="size-6 text-[#ffb362]" />
                      <span className={styles.statLabel}>Total Sales</span>
                    </div>
                    <p className={styles.statValue}>0</p>
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