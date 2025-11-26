import { X } from 'lucide-react';
import { useState } from 'react';
import styles from './CreateListingModal.module.css';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateListing: (listing: {
    title: string;
    price: number;
    category: string;
    description: string;
    image: string;
  }) => void;
  userEmail: string;
}

type Category = 'school' | 'apparel' | 'living' | 'services' | 'tickets';

export function CreateListingModal({ isOpen, onClose, onCreateListing, userEmail }: CreateListingModalProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('school');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl(''); // Clear URL if file is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !price) {
      alert('Please fill in title and price');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price');
      return;
    }

    onCreateListing({
      title,
      price: priceNum,
      category,
      description,
      image: imagePreview || imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    });

    // Reset form
    setTitle('');
    setPrice('');
    setCategory('school');
    setDescription('');
    setImageUrl('');
    setImageFile(null);
    setImagePreview('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create New Listing</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X className="size-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder="e.g., Calculus Textbook"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>
                Price ($) *
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={styles.input}
                placeholder="0.00"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.label}>
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className={styles.select}
                required
              >
                <option value="school">School</option>
                <option value="apparel">Apparel</option>
                <option value="living">Living</option>
                <option value="services">Services</option>
                <option value="tickets">Tickets</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder="Describe your item..."
              rows={4}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imageFile" className={styles.label}>
              Upload Image
            </label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            {imagePreview && (
              <div className={styles.imagePreviewContainer}>
                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
              </div>
            )}
            <p className={styles.hint}>Upload an image from your device (max 5MB)</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imageUrl" className={styles.label}>
              Or Use Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImageFile(null);
                setImagePreview('');
              }}
              className={styles.input}
              placeholder="https://example.com/image.jpg"
              disabled={!!imagePreview}
            />
            <p className={styles.hint}>Provide a URL to an image (alternative to upload)</p>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
