import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiCheck } from 'react-icons/fi';
import { ChefHat, Sparkles } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { useAuthStore } from '../../../store/authStore';
import Navigation from '../../../components/layout/Navigation/Navigation';
import { toast } from '../../../store/toastStore';

const Login = () => {
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
      await login(formData.email, formData.password);
      toast.success('Welcome back! 👋');
      navigate('/cook/dashboard');
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
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Navigation Component */}
      <Navigation />

      {/* Enhanced background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[30%] -right-[20%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute -bottom-[20%] -left-[30%] w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-amber-300/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="w-full max-w-[480px] relative z-10 animate-fade-in-up pt-20 pointer-events-auto">
        {/* Card Container */}
        <div className="glass-enhanced rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/50">
          {/* Logo with glow effect */}
          <div className="mb-8 text-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            </div>
            <ChefHat className="w-20 h-20 mx-auto text-primary animate-float relative z-10" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text mb-2 flex items-center justify-center gap-2">
              Welcome Back
              <Sparkles className="w-6 h-6 text-primary" />
            </h1>
            <p className="text-base text-text-secondary">Sign in to continue your culinary journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Error Message */}
            {errors.general && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm animate-fade-in">
                {errors.general}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              icon={<FiMail />}
              variant="glass"
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              icon={<FiLock />}
              variant="glass"
              error={errors.password}
              required
            />

            <div className="flex items-center justify-between -mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2" />
                <span className="text-sm text-text-secondary group-hover:text-text transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth size="large" loading={isLoading} className="mt-2 shadow-lg hover:shadow-xl">
              Sign In
            </Button>
          </form>

          {/* Benefits */}
          <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-xs font-semibold text-primary mb-3">What you'll get:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <FiCheck className="text-primary flex-shrink-0" />
                <span>Access to 1000+ recipes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <FiCheck className="text-primary flex-shrink-0" />
                <span>Save your favorite dishes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <FiCheck className="text-primary flex-shrink-0" />
                <span>Share recipes via QR codes</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center mt-8 text-base text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
