import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';
import { Shield } from 'lucide-react';
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
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Content */}
      <div className="w-full max-w-[480px] animate-fade-in-up">
        {/* Card Container */}
        <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl border border-gray-200">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="w-20 h-20 mx-auto bg-orange-500 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Portal
            </h1>
            <p className="text-base text-gray-600">Secure administrative access</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Error Message */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-fade-in">
                <div className="flex items-center gap-2">
                  <FiShield className="text-red-500" />
                  {errors.general}
                </div>
              </div>
            )}

            <Input
              label="Admin Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon={<FiMail />}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              icon={<FiLock />}
              error={errors.password}
              required
            />

            <Button 
              type="submit" 
              fullWidth 
              size="large" 
              loading={isLoading} 
              className="mt-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Sign In
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs font-semibold text-orange-900 mb-2 flex items-center gap-2">
              <FiShield className="text-orange-500" />
              Security Notice
            </p>
            <p className="text-xs text-gray-700 leading-relaxed">
              This is a protected area. All admin actions are logged and monitored for security purposes.
            </p>
          </div>

          {/* Footer */}
          <p className="text-center mt-8 text-sm text-gray-600">
            Not an admin?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="text-orange-500 font-semibold hover:text-orange-600 hover:underline"
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
