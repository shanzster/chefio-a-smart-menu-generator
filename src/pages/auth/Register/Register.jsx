import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCalendar, FiPhone, FiMapPin } from 'react-icons/fi';
import { ChefHat, Star } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { useAuthStore } from '../../../store/authStore';
import Navigation from '../../../components/layout/Navigation/Navigation';
import LegalModal from '../../../components/common/LegalModal/LegalModal';
import { toast } from '../../../store/toastStore';

const Register = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    birthdate: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalModalType, setLegalModalType] = useState('terms');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const openLegalModal = (type) => {
    setLegalModalType(type);
    setShowLegalModal(true);
  };

  const handleAcceptTerms = () => {
    setAgreedToTerms(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    // Validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.birthdate) {
      newErrors.birthdate = 'Birthdate is required';
    } else {
      // Check if user is at least 13 years old
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
      
      if (actualAge < 13) {
        newErrors.birthdate = 'You must be at least 13 years old';
      }
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'You must accept the Terms of Service and Privacy Policy';
    }
    
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
    
    try {
      const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`.trim();
      
      // Register with additional user data
      await register(formData.email, formData.password, fullName, {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        birthdate: formData.birthdate,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country
      });
      
      toast.success(`Welcome to Chefio, ${formData.firstName}! 🎉`);
      navigate('/cook/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to create account. Please try again.');
      setErrors({ 
        general: error.message || 'Failed to create account. Please try again.' 
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
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[20%] w-[500px] h-[500px] bg-primary/18 rounded-full blur-[100px] animate-float" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[600px] h-[600px] bg-secondary/12 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[50%] left-[50%] w-[350px] h-[350px] bg-amber-300/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="w-full max-w-[600px] relative z-10 animate-fade-in-up">
        {/* Card Container */}
        <div className="glass-enhanced rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/50 max-h-[90vh] overflow-y-auto">
          {/* Logo with glow effect */}
          <div className="mb-6 text-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
            </div>
            <ChefHat className="w-16 h-16 mx-auto text-primary animate-float relative z-10" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text mb-2 flex items-center justify-center gap-2">
              Join Chefio
              <Star className="w-6 h-6 text-primary fill-primary" />
            </h1>
            <p className="text-base text-text-secondary">Start your culinary journey today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Error Message */}
            {errors.general && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm animate-fade-in">
                {errors.general}
              </div>
            )}
            
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  icon={<FiUser />}
                  variant="glass"
                  error={errors.firstName}
                  required
                />

                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  icon={<FiUser />}
                  variant="glass"
                  error={errors.lastName}
                  required
                />
              </div>

              <Input
                label="Middle Name (Optional)"
                type="text"
                name="middleName"
                placeholder="Middle name"
                value={formData.middleName}
                onChange={handleChange}
                icon={<FiUser />}
                variant="glass"
              />

              <Input
                label="Birthdate"
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                icon={<FiCalendar />}
                variant="glass"
                error={errors.birthdate}
                helperText="You must be at least 13 years old"
                required
              />
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200/50">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Contact Information</h3>
              
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
                label="Phone Number"
                type="tel"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                icon={<FiPhone />}
                variant="glass"
                error={errors.phone}
                required
              />
            </div>

            {/* Address Information Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200/50">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Address</h3>
              
              <Input
                label="Street Address"
                type="text"
                name="address"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={handleChange}
                icon={<FiMapPin />}
                variant="glass"
                error={errors.address}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="City"
                  type="text"
                  name="city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={handleChange}
                  icon={<FiMapPin />}
                  variant="glass"
                  error={errors.city}
                  required
                />

                <Input
                  label="Country"
                  type="text"
                  name="country"
                  placeholder="USA"
                  value={formData.country}
                  onChange={handleChange}
                  icon={<FiMapPin />}
                  variant="glass"
                  error={errors.country}
                  required
                />
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200/50">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Security</h3>
              
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
            </div>

            <Button type="submit" fullWidth size="large" loading={isLoading} className="mt-4 shadow-lg hover:shadow-xl">
              Create Account
            </Button>
          </form>

          {/* Terms and Conditions */}
          <div className={`mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-xl border ${errors.terms ? 'border-error' : 'border-gray-200'}`}>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                }}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 flex-shrink-0" 
              />
              <span className="text-sm text-text-secondary leading-relaxed">
                I agree to the{' '}
                <button 
                  type="button"
                  onClick={() => openLegalModal('terms')}
                  className="text-primary font-medium hover:underline"
                >
                  Terms of Service
                </button>
                {' '}and{' '}
                <button 
                  type="button"
                  onClick={() => openLegalModal('privacy')}
                  className="text-primary font-medium hover:underline"
                >
                  Privacy Policy
                </button>
                , and confirm that I am at least 13 years old.
              </span>
            </label>
            {errors.terms && (
              <p className="text-sm text-error mt-2 ml-7">{errors.terms}</p>
            )}
          </div>

          {/* Footer */}
          <p className="text-center mt-6 text-base text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Legal Modal */}
      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        onAccept={handleAcceptTerms}
        type={legalModalType}
      />
    </div>
  );
};

export default Register;
