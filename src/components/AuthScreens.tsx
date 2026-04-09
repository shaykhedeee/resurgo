// ═══════════════════════════════════════════════════════════════════════════════
// RESURGOIFY - Authentication Screens
// Login, Signup, and Password Recovery
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Mountain, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Github,
  Chrome
} from 'lucide-react';

type AuthView = 'login' | 'signup' | 'forgot-password';

interface AuthScreensProps {
  onClose: () => void;
  onSuccess: () => void;
  initialView?: AuthView;
}

export function AuthScreens({ onClose, onSuccess, initialView = 'login' }: AuthScreensProps) {
  const [view, setView] = useState<AuthView>(initialView);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (view === 'login') {
      // Demo login - accept any email/password
      if (email && password) {
        // Store user session (demo)
        localStorage.setItem('resurgo-user', JSON.stringify({ 
          email, 
          name: email.split('@')[0],
          plan: 'free',
          createdAt: new Date().toISOString()
        }));
        setIsLoading(false);
        onSuccess();
        return;
      }
      setError('Please enter your email and password');
    } else if (view === 'signup') {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (!agreeToTerms) {
        setError('Please agree to the Terms of Service');
        setIsLoading(false);
        return;
      }
      // Store user session (demo)
      localStorage.setItem('resurgo-user', JSON.stringify({ 
        email, 
        name,
        plan: 'free',
        createdAt: new Date().toISOString()
      }));
      setIsLoading(false);
      onSuccess();
      return;
    } else if (view === 'forgot-password') {
      if (!email) {
        setError('Please enter your email');
        setIsLoading(false);
        return;
      }
      setSuccessMessage('Password reset link sent! Check your inbox.');
    }

    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    // Simulate social login
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('resurgo-user', JSON.stringify({ 
      email: `user@${provider}.com`, 
      name: 'Demo User',
      plan: 'free',
      createdAt: new Date().toISOString(),
      provider
    }));
    setIsLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ascend-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[100px]" />
      </div>

      {/* Auth Card */}
      <div className="relative w-full max-w-md">
        <div className="relative bg-[var(--background-secondary)] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 pb-0">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onClose}
                aria-label="Go back"
                title="Go back"
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ascend-500 to-ascend-600 
                              flex items-center justify-center">
                  <Mountain className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">RESURGO</span>
              </div>
              <div className="w-9" /> {/* Spacer for alignment */}
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {view === 'login' && 'Welcome Back'}
                {view === 'signup' && 'Create Account'}
                {view === 'forgot-password' && 'Reset Password'}
              </h2>
              <p className="text-white/60 text-sm">
                {view === 'login' && 'Sign in to continue your journey'}
                {view === 'signup' && 'Start your transformation today'}
                {view === 'forgot-password' && "We'll send you a reset link"}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-describedby={error ? 'form-error' : undefined}>
              {/* Error Message */}
              {error && (
                <div 
                  id="form-error"
                  role="alert"
                  aria-live="polite"
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                >
                  <span className="sr-only">Error:</span>
                  {error}
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div 
                  role="status"
                  aria-live="polite"
                  className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2"
                >
                  <span className="sr-only">Success:</span>
                  {successMessage}
                </div>
              )}

              {/* Name Field (Signup only) */}
              {view === 'signup' && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-white/80">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      autoComplete="name"
                      required
                      aria-required="true"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10
                               text-white placeholder-white/40 focus:outline-none focus:border-ascend-500/50
                               transition-colors min-h-[44px]"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white/80">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    aria-required="true"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10
                             text-white placeholder-white/40 focus:outline-none focus:border-ascend-500/50
                             transition-colors min-h-[44px]"
                  />
                </div>
              </div>

              {/* Password Field */}
              {view !== 'forgot-password' && (
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white/80">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={view === 'login' ? 'current-password' : 'new-password'}
                      required
                      aria-required="true"
                      className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10
                               text-white placeholder-white/40 focus:outline-none focus:border-ascend-500/50
                               transition-colors min-h-[44px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60
                               p-1 min-w-[44px] min-h-[44px] -mr-1 flex items-center justify-center"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password (Signup only) */}
              {view === 'signup' && (
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium text-white/80">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                    <input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                      aria-required="true"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10
                               text-white placeholder-white/40 focus:outline-none focus:border-ascend-500/50
                               transition-colors min-h-[44px]"
                    />
                  </div>
                </div>
              )}

              {/* Remember Me / Forgot Password (Login only) */}
              {view === 'login' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-ascend-500 
                               focus:ring-ascend-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-white/60">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setView('forgot-password')}
                    className="text-sm text-ascend-400 hover:text-ascend-300 transition-colors min-h-[44px] px-2 flex items-center"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Terms Agreement (Signup only) */}
              {view === 'signup' && (
                <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    required
                    aria-required="true"
                    className="mt-0.5 w-5 h-5 rounded border-white/20 bg-white/5 text-ascend-500 
                             focus:ring-ascend-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-white/60">
                    I agree to the{' '}
                    <Link href="/terms" className="text-ascend-400 hover:underline focus:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-ascend-400 hover:underline focus:underline">Privacy Policy</Link>
                  </span>
                </label>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-ascend-500 to-ascend-600
                         hover:from-ascend-400 hover:to-ascend-500 transition-all shadow-lg shadow-ascend-500/25
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                         min-h-[48px] focus-visible:ring-2 focus-visible:ring-ascend-400 focus-visible:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    <span className="sr-only">Loading...</span>
                  </>
                ) : (
                  <>
                    {view === 'login' && 'Sign In'}
                    {view === 'signup' && 'Create Account'}
                    {view === 'forgot-password' && 'Send Reset Link'}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            {view !== 'forgot-password' && (
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-[var(--background-secondary)] text-white/40">or continue with</span>
                </div>
              </div>
            )}

            {/* Social Login */}
            {view !== 'forgot-password' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  aria-label="Continue with Google"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl
                           bg-white/5 border border-white/10 hover:bg-white/10 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]
                           focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2"
                >
                  <Chrome className="w-5 h-5" aria-hidden="true" />
                  <span className="text-sm font-medium">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  disabled={isLoading}
                  aria-label="Continue with GitHub"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl
                           bg-white/5 border border-white/10 hover:bg-white/10 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]
                           focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2"
                >
                  <Github className="w-5 h-5" aria-hidden="true" />
                  <span className="text-sm font-medium">GitHub</span>
                </button>
              </div>
            )}

            {/* Toggle Auth View */}
            <p className="mt-6 text-center text-sm text-white/60">
              {view === 'login' && (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setView('signup'); setError(''); }}
                    className="text-ascend-400 hover:text-ascend-300 font-medium"
                  >
                    Sign up
                  </button>
                </>
              )}
              {view === 'signup' && (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setView('login'); setError(''); }}
                    className="text-ascend-400 hover:text-ascend-300 font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
              {view === 'forgot-password' && (
                <>
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => { setView('login'); setError(''); setSuccessMessage(''); }}
                    className="text-ascend-400 hover:text-ascend-300 font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Pro Badge */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <div className="p-4 rounded-xl bg-gradient-to-r from-ascend-500/10 to-gold-400/10 
                          border border-ascend-500/20">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <div>
                  <p className="text-sm font-medium text-white">Start with Pro free for 14 days</p>
                  <p className="text-xs text-white/50">No credit card required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
