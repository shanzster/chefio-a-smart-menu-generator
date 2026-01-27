import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { ChefHat } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { useAuthStore } from '../../../store/authStore';

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
    setTimeout(() => {
      login({ email: formData.email, role: 'cook', name: 'Student Chef' });
      navigate('/cook/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -right-[20%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[80px]" />
        <div className="absolute -bottom-[20%] -left-[30%] w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[80px]" />
      </div>

      {/* Content */}
      <div className="w-full max-w-[400px] lg:max-w-[450px] relative z-10 animate-fade-in-up">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-1 text-text-secondary font-medium p-2 -ml-2 rounded-md hover:text-text hover:bg-black/5 transition-colors">
          <FiArrowLeft />
          <span>Back</span>
        </Link>

        {/* Logo */}
        <div className="my-8 text-center">
          <ChefHat className="w-20 h-20 mx-auto text-primary animate-float" />
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-text mb-2">Welcome back</h1>
          <p className="text-base text-text-secondary">Sign in to continue cooking</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Email"
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

          <Link to="/forgot-password" className="self-end text-sm text-primary font-medium -mt-2 hover:underline">
            Forgot password?
          </Link>

          <Button type="submit" fullWidth size="large" loading={isLoading}>
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-text-tertiary">or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social login */}
        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center gap-2 h-[52px] glass rounded-md font-medium text-text hover:bg-white/75 hover:-translate-y-0.5 active:scale-[0.98] transition-all">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 h-[52px] glass rounded-md font-medium text-text hover:bg-white/75 hover:-translate-y-0.5 active:scale-[0.98] transition-all">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Apple
          </button>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-base text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
