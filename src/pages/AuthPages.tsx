import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Mail, Phone, User as UserIcon, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { AmBrandEmblem } from '../components/brand/AmBrandEmblem';

export const AuthPages: React.FC = () => {
  const { currentPage, setCurrentPage, registerCustomer, loginCustomer, showToast, isAdminLoggedIn, currentUser, settings } = useStore();

  const isRegister = currentPage === 'register';

  const [fullName, setFullName] = useState('');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt started for:', emailOrMobile);
    setIsLoading(true);

    if (forgotPasswordMode) {
      setTimeout(() => {
        setIsLoading(false);
        setForgotPasswordMode(false);
        showToast('Password reset link dispatched to your registered email.');
      }, 1000);
      return;
    }

    if (isRegister) {
      const res = await registerCustomer({
        fullName,
        email: emailOrMobile,
        mobile,
        password,
      });
      setIsLoading(false);
      if (res.success) {
        setCurrentPage('customer-dashboard');
      }
    } else {
      const res = await loginCustomer(emailOrMobile, password);
      setIsLoading(false);
      if (res.success) {
        if (res.isAdmin === true) {
          setCurrentPage('admin-dashboard');
        } else {
          setCurrentPage('customer-dashboard');
        }
      } else {
        showToast(res.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="bg-[#faf9f6] text-neutral-900 min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto flex flex-col items-center justify-center">
      
      <div className="w-full bg-white border border-neutral-200 p-8 sm:p-10 rounded-3xl space-y-6 shadow-md relative">
        
        {/* Brand Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <AmBrandEmblem size="md" showSubtitle={false} />
          
          <div className="space-y-1">
            <span className="text-amber-800 text-[10px] uppercase tracking-[0.25em] font-bold block">
              {settings.brandName || "NICE Perfumes"}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-neutral-950 tracking-tight uppercase font-bold">
              {forgotPasswordMode
                ? 'Reset Password'
                : isRegister
                ? 'Create Account'
                : 'Customer Login'}
            </h1>
          </div>
          <p className="text-xs text-neutral-600">
            {forgotPasswordMode
              ? 'Enter your email or mobile to receive reset instructions'
              : isRegister
              ? `Join ${settings.brandName || "NICE Perfumes"} to track orders & manage addresses`
              : 'Sign in to access your prepaid orders & tracking'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {isRegister && !forgotPasswordMode && (
            <div className="space-y-1.5">
              <label className="text-neutral-700 uppercase tracking-wider font-semibold">Full Name *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-500 text-neutral-900 rounded-xl pl-9 pr-3 py-3 focus:outline-none"
                />
              </div>
            </div>
          )}

          {!forgotPasswordMode && isRegister && (
            <div className="space-y-1.5">
              <label className="text-neutral-700 uppercase tracking-wider font-semibold">Mobile Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98XXXXXXXX"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-500 text-neutral-900 rounded-xl pl-9 pr-3 py-3 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-neutral-700 uppercase tracking-wider font-semibold">
              {isRegister ? 'Email Address *' : 'Email or Mobile Number *'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="name@example.com or mobile"
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-500 text-neutral-900 rounded-xl pl-9 pr-3 py-3 focus:outline-none"
              />
            </div>
          </div>

          {!forgotPasswordMode && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-neutral-700 uppercase tracking-wider font-semibold">Password *</label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setForgotPasswordMode(true)}
                    className="text-[10px] text-amber-800 hover:text-amber-950 hover:underline uppercase font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-500 text-neutral-900 rounded-xl pl-9 pr-3 py-3 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs tracking-[0.2em] uppercase rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <span>
              {forgotPasswordMode
                ? 'SEND RESET LINK'
                : isRegister
                ? 'CREATE ACCOUNT'
                : 'SIGN IN'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Mode Switchers */}
        <div className="pt-4 border-t border-neutral-100 text-center text-xs text-neutral-600">
          {forgotPasswordMode ? (
            <button
              onClick={() => setForgotPasswordMode(false)}
              className="text-neutral-900 font-semibold hover:underline uppercase tracking-wider text-[11px] cursor-pointer"
            >
              ← Back to Sign In
            </button>
          ) : isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-neutral-900 font-bold hover:underline uppercase ml-1 cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                onClick={() => setCurrentPage('register')}
                className="text-neutral-900 font-bold hover:underline uppercase ml-1 cursor-pointer"
              >
                Register Now
              </button>
            </p>
          )}
        </div>

      </div>

    </div>
  );
};
