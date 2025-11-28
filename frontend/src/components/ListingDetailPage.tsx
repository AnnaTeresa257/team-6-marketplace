import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import styles from './ListingDetailPage.module.css';

interface ListingDetailPageProps {
  listing: {
    id: number;
    title: string;
    price: number;
    seller: string;
    category: string;
    image: string;
    description?: string;
  };
  onNavigateBack: () => void;
}

export function ListingDetailPage({ listing, onNavigateBack }: ListingDetailPageProps) {
  const [isSold, setIsSold] = useState(false);

  const handleBuyNow = () => {
    // Handle purchase logic here
    alert(`Initiating purchase for ${listing.title}`);
  };

  const handleMarkAsSold = () => {
    setIsSold(true);
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
            <button className={styles.navButton}>LIST</button>
            <button className={styles.navButton}>CART</button>
            <button className={styles.navButton}>PROFILE</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <button
          onClick={onNavigateBack}
          className={styles.backButton}
        >
          <ArrowLeft className="size-5" />
          <span>Back to Listings</span>
        </button>

        <div className={styles.contentGrid}>
          {/* Left Column - Image */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <img
                src={listing.image}
                alt={listing.title}
                className={styles.itemImage}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const placeholder = document.createElement('div');
                    placeholder.className = styles.imagePlaceholder;
                    placeholder.textContent = 'Image';
                    parent.appendChild(placeholder);
                  }
                }}
              />
            </div>
            
            <div className={styles.buttonGroup}>
              <button className={styles.labelButton}>
                {listing.category.toUpperCase()}
              </button>
              <button
                onClick={handleMarkAsSold}
                className={styles.soldButton}
                disabled={isSold}
              >
                {isSold ? 'SOLD' : 'MARK AS SOLD'}
              </button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className={styles.detailsSection}>
            <h1 className={styles.itemTitle}>{listing.title}</h1>
            <p className={styles.itemPrice}>${listing.price.toFixed(2)}</p>
            
            <div className={styles.descriptionSection}>
              <p className={styles.descriptionText}>
                {listing.description || 'No description provided'}
              </p>
            </div>

            <button
              onClick={handleBuyNow}
              className={styles.buyButton}
            >
              BUY NOW
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
