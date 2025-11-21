import { User, Mail, Package, ShoppingCart, ArrowLeft, Edit2, Lock, Bell, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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

  const handleSaveProfile = () => {
    // Save to localStorage
    const profileData: ProfileData = {
      name,
      phone,
      bio,
    };
    localStorage.setItem(`profile_${userEmail}`, JSON.stringify(profileData));
    
    setIsEditing(false);
    toast.success('Profile updated successfully!');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#00306e] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onNavigateToDashboard}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <ArrowLeft className="size-6" />
                <span className="font-['Alumni_Sans:Regular',_sans-serif] text-[20px]">Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-12 bg-[#ffb362] rounded-full flex items-center justify-center">
                <ShoppingCart className="size-6" />
              </div>
              <h1 className="font-['Impact:Regular',_sans-serif] text-[32px]">GATOR MARKET</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="size-32 bg-[#00306e] rounded-full flex items-center justify-center mb-4">
                  <User className="size-16 text-white" />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-[#00306e] rounded-lg font-['Alumni_Sans:Regular',_sans-serif] text-[22px] text-center mb-2"
                    placeholder="Your Name"
                  />
                ) : (
                  <h2 className="font-['Impact:Regular',_sans-serif] text-[28px] text-[#00306e] mb-2">{name}</h2>
                )}
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Mail className="size-4" />
                  <p className="font-['Alumni_Sans:Regular',_sans-serif] text-[18px]">{userEmail}</p>
                </div>
                <p className="font-['Alumni_Sans:Regular',_sans-serif] text-[16px] text-gray-500">Member since {memberSince}</p>
              </div>

              {isEditing ? (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="font-['Alumni_Sans:Regular',_sans-serif] text-[18px] text-gray-700 mb-1 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-['Alumni_Sans:Regular',_sans-serif] text-[18px]"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  <div>
                    <label className="font-['Alumni_Sans:Regular',_sans-serif] text-[18px] text-gray-700 mb-1 block">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-['Alumni_Sans:Regular',_sans-serif] text-[18px] resize-none"
                      rows={3}
                      placeholder="Tell other students about yourself..."
                    />
                  </div>
                </div>
              ) : (
                <>
                  {phone && (
                    <p className="font-['Alumni_Sans:Regular',_sans-serif] text-[18px] text-gray-700 mb-2">
                      Phone: {phone}
                    </p>
                  )}
                  {bio && (
                    <p className="font-['Alumni_Sans:Regular',_sans-serif] text-[16px] text-gray-600 mb-4">
                      {bio}
                    </p>
                  )}
                </>
              )}

              {isEditing ? (
                <div className="space-y-2">
                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-[#00306e] hover:bg-[#004080] transition-colors text-white py-2 rounded-lg font-['Alumni_Sans:Regular',_sans-serif] text-[18px]"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="w-full bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 py-2 rounded-lg font-['Alumni_Sans:Regular',_sans-serif] text-[18px]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-[#ffb362] hover:bg-[#ffa347] transition-colors text-white py-2 rounded-lg flex items-center justify-center gap-2 font-['Alumni_Sans:Regular',_sans-serif] text-[18px]"
                >
                  <Edit2 className="size-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Statistics and Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-['Impact:Regular',_sans-serif] text-[28px] text-[#00306e] mb-4">Account Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#00306e] to-[#004080] p-4 rounded-lg text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="size-6" />
                    <span className="font-['Alumni_Sans:Regular',_sans-serif] text-[18px]">Active Listings</span>
                  </div>
                  <p className="font-['Impact:Regular',_sans-serif] text-[36px]">{myListings}</p>
                </div>
                <div className="bg-gradient-to-br from-[#ffb362] to-[#ffa347] p-4 rounded-lg text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingCart className="size-6" />
                    <span className="font-['Alumni_Sans:Regular',_sans-serif] text-[18px]">Total Sales</span>
                  </div>
                  <p className="font-['Impact:Regular',_sans-serif] text-[36px]">{totalSales}</p>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-['Impact:Regular',_sans-serif] text-[28px] text-[#00306e] mb-4">Account Settings</h3>
              <div className="space-y-3">
                <button
                  onClick={handleChangePassword}
                  className="w-full bg-white border-2 border-[#00306e] hover:bg-gray-50 transition-colors text-[#00306e] py-3 rounded-lg flex items-center gap-3 px-4 font-['Alumni_Sans:Regular',_sans-serif] text-[20px]"
                >
                  <Lock className="size-5" />
                  Change Password
                </button>
                <button
                  onClick={handleNotificationSettings}
                  className="w-full bg-white border-2 border-[#00306e] hover:bg-gray-50 transition-colors text-[#00306e] py-3 rounded-lg flex items-center gap-3 px-4 font-['Alumni_Sans:Regular',_sans-serif] text-[20px]"
                >
                  <Bell className="size-5" />
                  Notification Preferences
                </button>
                <button
                  onClick={handlePrivacySettings}
                  className="w-full bg-white border-2 border-[#00306e] hover:bg-gray-50 transition-colors text-[#00306e] py-3 rounded-lg flex items-center gap-3 px-4 font-['Alumni_Sans:Regular',_sans-serif] text-[20px]"
                >
                  <Shield className="size-5" />
                  Privacy Settings
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
              <h3 className="font-['Impact:Regular',_sans-serif] text-[28px] text-red-600 mb-4">Danger Zone</h3>
              <div className="space-y-3">
                <button
                  onClick={onLogout}
                  className="w-full bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 py-3 rounded-lg font-['Alumni_Sans:Regular',_sans-serif] text-[20px]"
                >
                  Log Out
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-600 hover:bg-red-700 transition-colors text-white py-3 rounded-lg font-['Alumni_Sans:Regular',_sans-serif] text-[20px]"
                >
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
