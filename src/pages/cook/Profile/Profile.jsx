import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiCamera, FiSave, FiEdit2 } from 'react-icons/fi';
import { User, Shield, Calendar } from 'lucide-react';
import Layout from '../../../components/layout/Layout/Layout';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { useAuthStore } from '../../../store/authStore';
import { toast } from '../../../store/toastStore';
import { updateUserProfile, updateUserPassword } from '../../../services/firebase/authService';
import { getUserRecipes } from '../../../services/firebase/recipeService';
import { getCookQRCodes } from '../../../services/firebase/qrCodeService';

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [stats, setStats] = useState({
    recipesCreated: 0,
    qrCodesGenerated: 0
  });

  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    bio: '',
    location: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || ''
      });

      // Load user statistics
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      console.log('Loading stats for user:', user.uid);
      
      // Count recipes
      const recipes = await getUserRecipes(user.uid);
      console.log('Recipes found:', recipes.length);
      
      // Count QR codes
      const qrCodes = await getCookQRCodes(user.uid);
      console.log('QR codes found:', qrCodes.length);

      setStats({
        recipesCreated: recipes.length,
        qrCodesGenerated: qrCodes.length
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!profileData.displayName.trim()) {
      toast.error('Display name is required');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({
        displayName: profileData.displayName,
        bio: profileData.bio,
        location: profileData.location,
        phone: profileData.phone
      });
      
      // Update local store
      updateUser({
        displayName: profileData.displayName,
        bio: profileData.bio,
        location: profileData.location,
        phone: profileData.phone
      });
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      await updateUserPassword(passwordData.currentPassword, passwordData.newPassword);
      
      toast.success('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error('Please log out and log in again to change your password');
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-text-secondary">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">Profile</h1>
              <p className="text-base text-text-secondary">Manage your account information</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Summary */}
          <div className="lg:col-span-1">
            <Card variant="glass" className="p-6 border border-white/50">
              <div className="text-center">
                {/* Profile Picture */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                    <FiCamera className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-text mb-1">
                  {user.displayName || 'User'}
                </h2>
                <p className="text-sm text-text-secondary mb-4">{user.email}</p>

                {/* Role Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                  <Shield className="w-4 h-4" />
                  {user.role === 'admin' ? 'Administrator' : 'Cook'}
                </div>

                {/* Account Info */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Content - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card variant="glass" className="p-6 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text">Profile Information</h3>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="small"
                    icon={<FiEdit2 />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <Input
                  label="Display Name"
                  type="text"
                  placeholder="Your name"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                  icon={<FiUser />}
                  variant="glass"
                  disabled={!isEditing}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  icon={<FiMail />}
                  variant="glass"
                  disabled
                  helperText="Email cannot be changed"
                />

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl text-text placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none ${
                      !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                <Input
                  label="Location"
                  type="text"
                  placeholder="City, Country"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  variant="glass"
                  disabled={!isEditing}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  variant="glass"
                  disabled={!isEditing}
                />

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          displayName: user.displayName || '',
                          email: user.email || '',
                          bio: user.bio || '',
                          location: user.location || '',
                          phone: user.phone || ''
                        });
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      fullWidth
                      icon={<FiSave />}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </form>
            </Card>

            {/* Change Password */}
            <Card variant="glass" className="p-6 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-text">Security</h3>
                  <p className="text-sm text-text-secondary">Update your password</p>
                </div>
                {!isChangingPassword && (
                  <Button
                    variant="outline"
                    size="small"
                    icon={<FiLock />}
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Change Password
                  </Button>
                )}
              </div>

              {isChangingPassword ? (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    icon={<FiLock />}
                    variant="glass"
                    required
                  />

                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    icon={<FiLock />}
                    variant="glass"
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    icon={<FiLock />}
                    variant="glass"
                    required
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      disabled={passwordLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      fullWidth
                      icon={<FiLock />}
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <FiLock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Your password is secure. Click "Change Password" to update it.</p>
                </div>
              )}
            </Card>

            {/* Account Statistics */}
            <Card variant="glass" className="p-6 border border-white/50">
              <h3 className="text-xl font-bold text-text mb-4">Account Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {stats.recipesCreated}
                  </div>
                  <div className="text-sm text-blue-800">Recipes Created</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {stats.qrCodesGenerated}
                  </div>
                  <div className="text-sm text-green-800">QR Codes Shared</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
