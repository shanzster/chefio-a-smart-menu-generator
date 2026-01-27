import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import { ChefHat } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { useAuthStore } from '../../../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login({ email: formData.email, role: 'cook', name: formData.name });
      navigate('/cook/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[20%] w-[500px] h-[500px] bg-primary/18 rounded-full blur-[80px]" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[600px] h-[600px] bg-secondary/12 rounded-full blur-[80px]" />
      </div>

      {/* Content */}
      <div className="w-full max-w-[400px] lg:max-w-[450px] relative z-10 animate-fade-in-up">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-1 text-text-secondary font-medium p-2 -ml-2 rounded-md hover:text-text hover:bg-black/5 transition-colors">
          <FiArrowLeft />
          <span>Back</span>
        </Link>

        {/* Logo */}
        <div className="my-6 text-center">
          <ChefHat className="w-16 h-16 mx-auto text-primary animate-float" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text mb-2">Create Account</h1>
          <p className="text-base text-text-secondary">Start your culinary journey today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            icon={<FiUser />}
            variant="glass"
            error={errors.name}
            required
          />

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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            icon={<FiLock />}
            variant="glass"
            error={errors.password}
            helperText="At least 6 characters"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            icon={<FiLock />}
            variant="glass"
            error={errors.confirmPassword}
            required
          />

          <Button type="submit" fullWidth size="large" loading={isLoading} className="mt-2">
            Create Account
          </Button>
        </form>

        {/* Terms */}
        <p className="text-center text-sm text-text-tertiary mt-6 leading-relaxed">
          By signing up, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </p>

        {/* Footer */}
        <p className="text-center mt-8 text-base text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
