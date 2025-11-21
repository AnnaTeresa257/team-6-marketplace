import { User, Mail, Package, ShoppingCart, ArrowLeft, Edit2, Lock, Bell, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import styles from './ProfilePage.module.css';

interface ProfilePageProps {
  userEmail: string;
  onNavigateToDashboard: () => void;
  onLogout: () => void;
}

interface ProfileData {
  name: string;
  phone: string;
  bio: string;
}

export function ProfilePage({ userEmail, onNavigateToDashboard, onLogout }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Student Name');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  
  // Temporary edit values
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBio, setEditBio] = useState('');

  // Load saved profile data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem(`profile_${userEmail}`);
    if (savedProfile) {
      const profileData: ProfileData = JSON.parse(savedProfile);
      setName(profileData.name || 'Student Name');
      setPhone(profileData.phone || '');
      setBio(profileData.bio || '');
    }
  }, [userEmail]);

  const handleEditClick = () => {
    // Copy current values to edit fields
    setEditName(name);
    setEditPhone(phone);
    setEditBio(bio);
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    // Save edited values to actual state
    setName(editName);
    setPhone(editPhone);
    setBio(editBio);
    
    // Save to localStorage
    const profileData: ProfileData = {
      name: editName,
      phone: editPhone,
      bio: editBio,
    };
    localStorage.setItem(`profile_${userEmail}`, JSON.stringify(profileData));
    
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    // Discard changes and close edit mode
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    toast.info('Change password feature would open a secure form');
  };

  const handleNotificationSettings = () => {
    toast.info('Notification preferences would open');
  };

  const handlePrivacySettings = () => {
    toast.info('Privacy settings would open');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion would require confirmation');
  };

  // Mock data for user stats
  const myListings = 2;
  const totalSales = 0;
  const memberSince = 'September 2024';

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={onNavigateToDashboard} className={styles.backButton}>
            <ArrowLeft className="size-6" />
            <span>Back to Dashboard</span>
          </button>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <ShoppingCart className="size-6" />
            </div>
            <h1 className={styles.logoText}>GATOR MARKET</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.grid}>
          {/* Left Column - Profile Card */}
          <div>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.profileIcon}>
                  <User className="size-16 text-white" />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={styles.nameInput}
                    placeholder="Your Name"
                  />
                ) : (
                  <h2 className={styles.profileName}>{name}</h2>
                )}
                <div className={styles.profileEmail}>
                  <Mail className="size-4" />
                  <p className={styles.profileEmailText}>{userEmail}</p>
                </div>
                <p className={styles.memberSince}>Member since {memberSince}</p>
              </div>

              {isEditing ? (
                <div>
                  <div className={styles.editSection}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className={styles.input}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  <div className={styles.editSection}>
                    <label className={styles.label}>Bio (max 100 characters)</label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className={styles.textarea}
                      rows={3}
                      maxLength={100}
                      placeholder="Tell other students about yourself..."
                    />
                    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '0.25rem' }}>
                      {editBio.length}/100 characters
                    </p>
                  </div>
                  <button onClick={handleSaveProfile} className={styles.saveButton}>
                    Save Changes
                  </button>
                  <button onClick={handleCancel} className={styles.cancelButton}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  {phone && <p className={styles.phoneText}>Phone: {phone}</p>}
                  {bio && <p className={styles.bioText}>{bio}</p>}
                  <button onClick={handleEditClick} className={styles.editButton}>
                    <Edit2 className="size-4" />
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Statistics and Settings */}
          <div className={styles.rightColumn}>
            {/* Account Statistics */}
            <div className={styles.statsCard}>
              <h3 className={styles.sectionTitle}>Account Statistics</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <div className={styles.statHeader}>
                    <Package className="size-6" />
                    <span className={styles.statLabel}>Active Listings</span>
                  </div>
                  <p className={styles.statValue}>{myListings}</p>
                </div>
                <div className={`${styles.statBox} ${styles.orange}`}>
                  <div className={styles.statHeader}>
                    <ShoppingCart className="size-6" />
                    <span className={styles.statLabel}>Total Sales</span>
                  </div>
                  <p className={styles.statValue}>{totalSales}</p>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className={styles.settingsCard}>
              <h3 className={styles.sectionTitle}>Account Settings</h3>
              <div className={styles.settingsButtons}>
                <button onClick={handleChangePassword} className={styles.settingButton}>
                  <Lock className="size-5" />
                  Change Password
                </button>
                <button onClick={handleNotificationSettings} className={styles.settingButton}>
                  <Bell className="size-5" />
                  Notification Preferences
                </button>
                <button onClick={handlePrivacySettings} className={styles.settingButton}>
                  <Shield className="size-5" />
                  Privacy Settings
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className={styles.dangerCard}>
              <h3 className={styles.dangerTitle}>Danger Zone</h3>
              <div className={styles.dangerButtons}>
                <button onClick={onLogout} className={styles.logoutButton}>
                  Log Out
                </button>
                <button onClick={handleDeleteAccount} className={styles.deleteButton}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
