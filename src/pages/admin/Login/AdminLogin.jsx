import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';
import { Shield, Sparkles } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { useAuthStore } from '../../../store/authStore';
import { toast } from '../../../store/toastStore';
import { isAdmin } from '../../../services/firebase/adminService';

const AdminLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Login user
      const user = await login(formData.email, formData.password);
      
      // Check if user has admin role
      const hasAdminRole = await isAdmin(user.uid);
      
      if (!hasAdminRole) {
        toast.error('Access Denied: Admin privileges required');
        setErrors({
          general: 'You do not have administrator access.'
        });
        // Logout non-admin user
        useAuthStore.getState().logout();
        setIsLoading(false);
        return;
      }

      toast.success('Admin login successful! 🛡️');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to login. Please check your credentials.');
      setErrors({
        general: error.message || 'Failed to login. Please check your credentials.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[30%] -right-[20%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute -bottom-[20%] -left-[30%] w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-indigo-300/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="w-full max-w-[480px] relative z-10 animate-fade-in-up pointer-events-auto">
        {/* Card Container */}
        <div className="glass-enhanced rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/20">
          {/* Logo with glow effect */}
          <div className="mb-8 text-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-purple-500/30 rounded-full blur-2xl" />
            </div>
            <Shield className="w-20 h-20 mx-auto text-purple-400 animate-float relative z-10" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              Admin Portal
              <Sparkles className="w-6 h-6 text-purple-400" />
            </h1>
            <p className="text-base text-gray-300">Secure administrative access</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Error Message */}
            {errors.general && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm animate-fade-in">
                <div className="flex items-center gap-2">
                  <FiShield className="text-red-400" />
                  {errors.general}
                </div>
              </div>
            )}

            <Input
              label="Admin Email"
              type="email"
              name="email"
              placeholder="admin@chefio.app"
              value={formData.email}
              onChange={handleChange}
              icon={<FiMail />}
              variant="glass"
              error={errors.email}
              required
              className="text-white"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter admin password"
              value={formData.password}
              onChange={handleChange}
              icon={<FiLock />}
              variant="glass"
              error={errors.password}
              required
              className="text-white"
            />

            <Button 
              type="submit" 
              fullWidth 
              size="large" 
              loading={isLoading} 
              className="mt-2 bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl"
            >
              <FiShield className="mr-2" />
              Admin Sign In
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <p className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-2">
              <FiShield className="text-purple-400" />
              Security Notice
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              This is a protected area. All admin actions are logged and monitored for security purposes.
            </p>
          </div>

          {/* Footer */}
          <p className="text-center mt-8 text-sm text-gray-400">
            Not an admin?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="text-purple-400 font-semibold hover:underline"
            >
              User Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
