import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { ChefHat, Mail } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import Navigation from '../../../components/layout/Navigation/Navigation';
import { resetPassword } from '../../../services/firebase/authService';
import { toast } from '../../../store/toastStore';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox 📧');
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
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
        <div className="absolute -top-[30%] -right-[20%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute -bottom-[20%] -left-[30%] w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-amber-300/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="w-full max-w-[480px] relative z-10 animate-fade-in-up">
        {/* Card Container */}
        <div className="glass-enhanced rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/50">
          {/* Back Button */}
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          {!emailSent ? (
            <>
              {/* Logo with glow effect */}
              <div className="mb-8 text-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                </div>
                <Mail className="w-20 h-20 mx-auto text-primary animate-float relative z-10" />
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-text mb-2">Forgot Password?</h1>
                <p className="text-base text-text-secondary">
                  No worries! Enter your email and we'll send you reset instructions.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm animate-fade-in">
                    {error}
                  </div>
                )}

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  icon={<FiMail />}
                  variant="glass"
                  error={error ? ' ' : ''}
                  required
                />

                <Button 
                  type="submit" 
                  fullWidth 
                  size="large" 
                  loading={isLoading} 
                  className="mt-2 shadow-lg hover:shadow-xl"
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center py-8">
                {/* Success Icon */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-success/20 rounded-full blur-2xl" />
                  </div>
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-success to-success-dark flex items-center justify-center relative z-10 shadow-lg">
                    <FiCheck className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Success Message */}
                <h2 className="text-2xl font-bold text-text mb-3">Check Your Email!</h2>
                <p className="text-base text-text-secondary mb-2">
                  We've sent a password reset link to:
                </p>
                <p className="text-base font-semibold text-primary mb-6">
                  {email}
                </p>
                <p className="text-sm text-text-secondary mb-8">
                  Click the link in the email to reset your password. If you don't see it, check your spam folder.
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                    variant="outline"
                    fullWidth
                  >
                    Send Another Email
                  </Button>
                  
                  <Link to="/login">
                    <Button fullWidth>
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Footer - Only show when not in success state */}
          {!emailSent && (
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                <strong>Remember your password?</strong>{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
