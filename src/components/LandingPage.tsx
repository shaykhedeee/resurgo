// ═══════════════════════════════════════════════════════════════════════════════
// RESURGOIFY - Landing Page Component
// Premium SaaS landing page with features, pricing, testimonials
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { 
  Mountain, 
  Sparkles, 
  Target, 
  Brain, 
  Zap, 
  Trophy,
  Check,
  ChevronRight,
  Star,
  ArrowRight,
  Play,
  Shield,
  Clock,
  BarChart3,
  Calendar,
  Users,
  Download,
  Menu,
  X,
  Heart,
  Bell,
  Timer,
  ListTodo,
  Gamepad2,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // PWA Install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    setDeferredPrompt(null);
  };

  const features = [
    {
      icon: Brain,
      title: 'AI Goal Decomposition',
      description: 'Our AI breaks down your ultimate goals into achievable milestones, weekly objectives, and daily tasks.',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Target,
      title: 'Smart Habit Tracking',
      description: 'Track habits with beautiful visualizations. See your streaks, completion rates, and progress over time.',
      color: 'text-ascend-400',
      bgColor: 'bg-ascend-500/10',
    },
    {
      icon: Trophy,
      title: 'Gamified Progress',
      description: 'Earn XP, level up, unlock achievements, and celebrate your wins with satisfying animations.',
      color: 'text-gold-400',
      bgColor: 'bg-gold-400/10',
    },
    {
      icon: BarChart3,
      title: 'Powerful Analytics',
      description: 'Understand your patterns with detailed charts, weekly breakdowns, and performance insights.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Calendar,
      title: 'Calendar View',
      description: 'See your entire month at a glance. Track perfect days, streaks, and plan ahead.',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data stays on your device. Export anytime. No ads, no tracking, just progress.',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Entrepreneur',
      avatar: 'S',
      content: 'RESURGO helped me break down my goal of launching a startup into daily actionable tasks. I went from overwhelmed to organized in days.',
      rating: 5,
    },
    {
      name: 'Marcus Johnson',
      role: 'Fitness Coach',
      avatar: 'M',
      content: 'The gamification keeps me motivated. Seeing my XP grow and unlocking achievements makes habit tracking actually fun.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Medical Student',
      avatar: 'E',
      content: 'I use RESURGO to manage my study goals and self-care habits. The AI decomposition feature is a game-changer for complex goals.',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Up to 3 habits',
        '1 active goal',
        'Basic analytics',
        '7-day history',
        'Light & dark themes',
      ],
      limitations: [
        'No AI goal decomposition',
        'No data export',
        'Limited achievements',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$5',
      period: '/month',
      description: 'For serious goal achievers',
      features: [
        'Unlimited habits',
        'Unlimited goals',
        'AI goal decomposition',
        'Advanced analytics',
        'Full history access',
        'Data export (JSON & PDF)',
        'All achievements',
        'Priority support',
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Lifetime',
      price: '$99',
      period: 'one-time',
      description: 'Best value, forever access',
      features: [
        'Everything in Pro',
        'Lifetime updates',
        'Early access features',
        'Exclusive badges',
        'Direct support channel',
      ],
      limitations: [],
      cta: 'Get Lifetime Access',
      popular: false,
    },
  ];

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '2M+', label: 'Habits Tracked' },
    { value: '500K+', label: 'Goals Achieved' },
    { value: '4.9', label: 'App Store Rating' },
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      {/* Section Gradient Transitions */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-ascend-500 via-purple-500 to-transparent" />
        <div className="absolute top-[40vh] left-0 w-full h-[30vh] bg-gradient-to-b from-purple-500 via-gold-400 to-transparent" />
        <div className="absolute top-[70vh] left-0 w-full h-[30vh] bg-gradient-to-b from-gold-400 via-blue-500 to-[#0A0A0B]" />
      </div>
      {/* Gradient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-ascend-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold-400/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-gradient-to-r from-[#0A0A0B] via-ascend-500/10 to-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo - Centered Branding */}
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">RESURGO</span>
                <span className="text-[9px] text-white/50 tracking-[0.2em] uppercase">by WEBNESS</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm text-white/70 hover:text-white transition-colors">Testimonials</a>
              <a href="#faq" className="text-sm text-white/70 hover:text-white transition-colors">FAQ</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {showInstallButton && (
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                           text-ascend-400 border border-ascend-500/30 hover:bg-ascend-500/10 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Install App
                </button>
              )}
              <button
                onClick={onLogin}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={onGetStarted}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-ascend-500 to-ascend-600
                         hover:from-ascend-400 hover:to-ascend-500 transition-all shadow-lg shadow-ascend-500/25"
              >
                Get Started Free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 min-w-[44px] min-h-[44px] flex items-center justify-center
                       focus-visible:ring-2 focus-visible:ring-ascend-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B]"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden border-t border-white/5 bg-[#0A0A0B]/95 backdrop-blur-xl"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-3 text-white/70 hover:text-white transition-colors min-h-[44px] flex items-center">Features</a>
              <a href="#pricing" className="block py-3 text-white/70 hover:text-white transition-colors min-h-[44px] flex items-center">Pricing</a>
              <a href="#testimonials" className="block py-3 text-white/70 hover:text-white transition-colors min-h-[44px] flex items-center">Testimonials</a>
              <a href="#faq" className="block py-3 text-white/70 hover:text-white transition-colors min-h-[44px] flex items-center">FAQ</a>
              <div className="pt-3 space-y-2">
                {showInstallButton && (
                  <button
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg
                             border border-ascend-500/30 text-ascend-400 min-h-[44px]
                             focus-visible:ring-2 focus-visible:ring-ascend-500 focus-visible:ring-offset-2"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Install App
                  </button>
                )}
                <button 
                  onClick={onLogin} 
                  className="w-full py-3 rounded-lg text-white/80 border border-white/10 min-h-[44px]
                           hover:bg-white/5 transition-colors
                           focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2"
                >
                  Log In
                </button>
                <button
                  onClick={onGetStarted}
                  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-ascend-500 to-ascend-600 min-h-[44px]
                           hover:from-ascend-400 hover:to-ascend-500 transition-all
                           focus-visible:ring-2 focus-visible:ring-ascend-400 focus-visible:ring-offset-2"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-ascend-500/10 via-purple-500/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ascend-500/10 border border-ascend-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-ascend-400" />
              <span className="text-sm text-ascend-400 font-medium">AI-Powered Goal Achievement</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in">
              Achieve Your Ambitious Goals
              <span className="block mt-2 bg-gradient-to-r from-ascend-400 via-gold-400 to-ascend-400 bg-clip-text text-transparent animate-gradient-slide">
                One Step at a Time
              </span>
            </h1>

            {/* Subheadline - More specific value proposition */}
            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-delay">
              Resurgo is your advanced habit and goal achievement platform. Our AI breaks down your dreams into actionable milestones, daily tasks, and personalized plans. Build habits that last, track your progress, and unlock your full potential.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-ascend-500 to-ascend-600 hover:from-ascend-400 hover:to-ascend-500 shadow-lg shadow-ascend-500/25 transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-ascend-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B] active:scale-[0.98] min-h-[56px] animate-bounce"
                aria-label="Get started for free"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
              <button 
                onClick={() => setShowDemoModal(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B] active:scale-[0.98] min-h-[56px] animate-fade-in-delay"
                aria-label="Watch demo video"
              >
                <Play className="w-5 h-5" aria-hidden="true" />
                See How It Works
              </button>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm text-white/50 animate-fade-in-delay">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Privacy Focused</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Quick Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>50,000+ Users</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto animate-fade-in-delay">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-white animate-count-up" data-value={stat.value.replace('+','')}>{stat.value}</p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* App Preview - Mock */}
          <div className="mt-16 sm:mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent z-10" />
            <div className="relative mx-auto max-w-5xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-ascend-500/10">
              <div className="aspect-[16/10] bg-gradient-to-br from-[#141416] to-[#0A0A0B] p-6 sm:p-10">
                {/* Mock Dashboard */}
                <div className="h-full flex flex-col gap-4">
                  {/* Mock Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-ascend-500/20 flex items-center justify-center">
                        <Mountain className="w-5 h-5 text-ascend-400" />
                      </div>
                      <div>
                        <div className="h-4 w-24 bg-white/10 rounded" />
                        <div className="h-3 w-16 bg-white/5 rounded mt-1" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-20 bg-white/5 rounded-lg" />
                      <div className="h-8 w-8 bg-white/5 rounded-lg" />
                    </div>
                  </div>

                  {/* Mock Content */}
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-4">
                      <div className="h-32 rounded-xl bg-white/5 border border-white/5" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-xl bg-white/5 border border-white/5" />
                        <div className="h-24 rounded-xl bg-white/5 border border-white/5" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-20 rounded-xl bg-ascend-500/10 border border-ascend-500/20" />
                      <div className="h-20 rounded-xl bg-gold-400/10 border border-gold-400/20" />
                      <div className="h-20 rounded-xl bg-white/5 border border-white/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-500/10 via-gold-400/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to <span className="text-ascend-400">Transform</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              One unified system to become your ideal self. AI does the planning, you do the becoming.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 
                         hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", feature.bgColor)}>
                  <feature.icon className={cn("w-6 h-6", feature.color)} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADHD & Focus-Friendly Section */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400 font-medium">Designed for How Your Brain Works</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Finally, a Habit App for 
                <span className="text-purple-400"> Neurodivergent</span> Minds
              </h2>
              
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                Traditional habit apps assume everyone thinks the same way. RESURGO is built with ADHD, 
                autism, and other neurodivergent minds in focus. Less overwhelm, more wins.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: ListTodo,
                    title: 'Micro-task Breakdown',
                    description: 'Every task can be broken into smaller, less overwhelming steps'
                  },
                  {
                    icon: Timer,
                    title: 'Built-in Pomodoro Timer',
                    description: 'Work in focused bursts with timed breaks to maintain momentum'
                  },
                  {
                    icon: Gamepad2,
                    title: 'Dopamine-Friendly Rewards',
                    description: 'XP, levels, streaks, and celebrations that feel genuinely satisfying'
                  },
                  {
                    icon: Bell,
                    title: 'Gentle, Helpful Reminders',
                    description: 'Smart notifications that encourage without shame or judgment'
                  },
                  {
                    icon: Heart,
                    title: 'Streak Protection',
                    description: 'Freeze days protect your progress when life gets overwhelming'
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-white/60">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Demo */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-[#1a1a1c] to-[#0d0d0e] rounded-2xl border border-white/10 p-6 shadow-2xl">
                {/* Mock Task Breakdown */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold">Today&apos;s Focus</h4>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Timer className="w-4 h-4" />
                      <span>25:00 Pomodoro</span>
                    </div>
                  </div>

                  {/* Task with micro-tasks */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-ascend-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-ascend-400" />
                      </div>
                      <span className="font-medium">Write project proposal</span>
                      <span className="ml-auto text-xs text-ascend-400">+25 XP</span>
                    </div>
                    <div className="ml-9 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="line-through">Open document</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="line-through">Write introduction</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded border border-purple-400"></div>
                        <span>Outline main points</span>
                      </div>
                    </div>
                  </div>

                  {/* Streak protection badge */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gold-400/10 to-transparent border border-gold-400/20">
                    <Shield className="w-5 h-5 text-gold-400" />
                    <div>
                      <p className="text-sm font-medium">Streak Protected!</p>
                      <p className="text-xs text-white/50">2 freeze days remaining this month</p>
                    </div>
                  </div>

                  {/* XP Progress */}
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ascend-500 to-gold-400 flex items-center justify-center text-sm font-bold">
                      14
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Level Progress</span>
                        <span className="text-ascend-400">850/1000 XP</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-ascend-500 to-gold-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating celebration */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-sm font-medium shadow-lg shadow-purple-500/25 animate-float">
                3-Day Streak
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-y border-white/5 bg-gradient-to-b from-black via-[#18181b] to-black">
        <div className="max-w-7xl mx-auto relative">
          {/* Magic particles around CTA */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10 pointer-events-none">
            <div className="magic-particles" />
          </div>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 animate-fade-in">
              How <span className="text-gold-400">RESURGO</span> Works
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto animate-fade-in-delay">
              Three clear steps to turn goals into consistent action
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-10 relative">
            {/* Step 1 */}
            <div className="flex-1 bg-gradient-to-br from-[#18181b] via-black to-[#18181b] rounded-2xl p-8 shadow-xl border border-white/10 relative animate-fade-in">
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                <div className="magic-particles" />
              </div>
              <div className="flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-ascend-400 animate-pulse" />
              </div>
              <div className="text-xs text-ascend-400 font-semibold mb-2">Step 1</div>
              <h3 className="text-2xl font-bold mb-3">Set Your Ultimate Goal</h3>
              <p className="text-white/70 text-base leading-relaxed">Tell us what you want to achieve. Whether it&apos;s launching a business, getting fit, or learning a new skill.</p>
            </div>
            {/* Animated connector */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-10 h-10 flex items-center justify-center">
                <span className="block w-2 h-10 bg-gradient-to-b from-gold-400 via-ascend-400 to-purple-400 rounded-full animate-gradient-slide" />
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex-1 bg-gradient-to-br from-[#18181b] via-black to-[#18181b] rounded-2xl p-8 shadow-xl border border-white/10 relative animate-fade-in-delay">
              <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
                <div className="magic-particles" />
              </div>
              <div className="flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-purple-400 animate-pulse" />
              </div>
              <div className="text-xs text-purple-400 font-semibold mb-2">Step 2</div>
              <h3 className="text-2xl font-bold mb-3">AI Creates Your Plan</h3>
              <p className="text-white/70 text-base leading-relaxed">Our AI breaks down your goal into milestones, weekly objectives, and daily tasks tailored to your timeline.</p>
            </div>
            {/* Animated connector */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-10 h-10 flex items-center justify-center">
                <span className="block w-2 h-10 bg-gradient-to-b from-purple-400 via-gold-400 to-ascend-400 rounded-full animate-gradient-slide" />
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex-1 bg-gradient-to-br from-[#18181b] via-black to-[#18181b] rounded-2xl p-8 shadow-xl border border-white/10 relative animate-fade-in-delay">
              <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
                <div className="magic-particles" />
              </div>
              <div className="flex items-center justify-center mb-6">
                <Trophy className="w-7 h-7 text-gold-400 animate-pulse" />
              </div>
              <div className="text-xs text-gold-400 font-semibold mb-2">Step 3</div>
              <h3 className="text-2xl font-bold mb-3">Track & Level Up</h3>
              <p className="text-white/70 text-base leading-relaxed">Complete daily tasks, build habits, earn XP, and watch as your progress compounds into real results.</p>
              {/* CTA with magic effect */}
              <div className="mt-8 flex items-center justify-center relative">
                <button onClick={onGetStarted} className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-gold-400 to-ascend-500 shadow-lg shadow-gold-400/25 transition-all flex items-center gap-2 animate-bounce magic-particles">
                  Get Started Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span className="text-ascend-400">RESURGO</span>?
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              See how we compare to other popular habit tracking apps
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-4 text-white/70 font-medium">Feature</th>
                  <th className="p-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-ascend-500/20 to-gold-400/20 border border-ascend-500/30">
                      <Mountain className="w-4 h-4 text-ascend-400" />
                      <span className="font-bold text-ascend-400">RESURGO</span>
                    </div>
                  </th>
                  <th className="p-4 text-center text-white/50">Habitica</th>
                  <th className="p-4 text-center text-white/50">Streaks</th>
                  <th className="p-4 text-center text-white/50">Todoist</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { feature: 'AI Goal Decomposition', ascend: true, habitica: false, streaks: false, todoist: false },
                  { feature: 'Smart Habit Suggestions', ascend: true, habitica: false, streaks: false, todoist: false },
                  { feature: 'Gamification & XP System', ascend: true, habitica: true, streaks: false, todoist: false },
                  { feature: 'Streak Protection', ascend: true, habitica: false, streaks: false, todoist: false },
                  { feature: 'Built-in Pomodoro Timer', ascend: true, habitica: false, streaks: false, todoist: false },
                  { feature: 'ADHD-Friendly Design', ascend: true, habitica: false, streaks: false, todoist: false },
                  { feature: 'Calendar Heat Map', ascend: true, habitica: false, streaks: true, todoist: false },
                  { feature: 'Privacy-First (Offline PWA)', ascend: true, habitica: false, streaks: true, todoist: false },
                  { feature: 'Free Unlimited Habits', ascend: 'Pro', habitica: true, streaks: false, todoist: true },
                  { feature: 'Price', ascend: '$5/mo', habitica: 'Free*', streaks: '$5', todoist: '$4/mo' },
                ].map((row, index) => (
                  <tr key={index} className="border-t border-white/5">
                    <td className="p-4 text-white/80">{row.feature}</td>
                    <td className="p-4 text-center">
                      {row.ascend === true ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : row.ascend === false ? (
                        <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : (
                        <span className="text-ascend-400 font-medium">{row.ascend}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.habitica === true ? (
                        <Check className="w-5 h-5 text-white/50 mx-auto" />
                      ) : row.habitica === false ? (
                        <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : (
                        <span className="text-white/50">{row.habitica}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.streaks === true ? (
                        <Check className="w-5 h-5 text-white/50 mx-auto" />
                      ) : row.streaks === false ? (
                        <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : (
                        <span className="text-white/50">{row.streaks}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.todoist === true ? (
                        <Check className="w-5 h-5 text-white/50 mx-auto" />
                      ) : row.todoist === false ? (
                        <X className="w-5 h-5 text-white/20 mx-auto" />
                      ) : (
                        <span className="text-white/50">{row.todoist}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="text-center text-xs text-white/40 mt-6">
            * Habitica has premium features starting at $5/month. Comparison as of January 2025.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent <span className="text-ascend-400">Pricing</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Start free, upgrade when you&apos;re ready. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={cn(
                  "relative rounded-2xl p-6 sm:p-8 border transition-all duration-300",
                  plan.popular
                    ? "bg-gradient-to-b from-ascend-500/10 to-transparent border-ascend-500/30 scale-105"
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full
                                bg-gradient-to-r from-ascend-500 to-ascend-600 text-xs font-semibold">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-white/50 text-sm mb-4">{plan.description}</p>
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-white/50">{plan.period}</span>
                </div>

                <button
                  onClick={onGetStarted}
                  className={cn(
                    "w-full py-3 rounded-xl font-semibold transition-all mb-6",
                    plan.popular
                      ? "bg-gradient-to-r from-ascend-500 to-ascend-600 hover:from-ascend-400 hover:to-ascend-500"
                      : "bg-white/5 hover:bg-white/10 border border-white/10"
                  )}
                >
                  {plan.cta}
                </button>

                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-ascend-400 shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <X className="w-4 h-4 text-white/30 shrink-0" />
                      <span className="text-white/40">{limitation}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by <span className="text-gold-400">Thousands</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              See what our users have to say about their transformation journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">&quot;{testimonial.content}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ascend-500 to-gold-400
                                flex items-center justify-center text-sm font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-white/50">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - SEO Optimized */}
      <section id="faq" className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-ascend-400">Questions</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Everything you need to know about building better habits with RESURGO
            </p>
          </div>

          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {[
              {
                question: "What is RESURGO and how does it work?",
                answer: "RESURGO is an AI-powered habit tracking app that helps you transform ambitious goals into achievable daily tasks. Our AI analyzes your goal, breaks it down into milestones, weekly objectives, and daily habits, making even the biggest dreams feel manageable. You track your progress, earn XP, level up, and watch your life transform through consistent daily action."
              },
              {
                question: "is RESURGO free to use?",
                answer: "Yes! RESURGO offers a generous free plan that includes up to 3 habits, 1 active goal, basic analytics, 7-day history, and both light and dark themes. For unlimited habits, AI goal decomposition, advanced analytics, and full history access, you can upgrade to Pro at $5/month or get lifetime access for a one-time payment of $99."
              },
              {
                question: "How does AI goal decomposition work?",
                answer: "Our AI uses advanced language models to understand your ultimate goal and create a personalized roadmap. It generates realistic milestones spread across your timeline, weekly focus areas with specific objectives, and daily actionable tasks that fit your schedule. The AI adapts recommendations based on behavioral science and habit formation research."
              },
              {
                question: "What makes RESURGO different from other habit trackers?",
                answer: "Unlike other habit trackers that just track streaks, RESURGO offers true AI-powered goal decomposition, gamified progress with XP and levels, intelligent habit suggestions, streak protection features, and detailed pattern analytics. We're the only habit app that thinks like a personal coach, helping you plan AND execute."
              },
              {
                question: "Is my data private and secure?",
                answer: "Absolutely. Your data stays on your device by default - we don't track you or sell your data. RESURGO works offline as a Progressive Web App (PWA), and you can export your data anytime. We use industry-standard encryption for any cloud features, and our AI processing is done securely with no data retention."
              },
              {
                question: "Can I use RESURGO on multiple devices?",
                answer: "Yes! RESURGO is a Progressive Web App (PWA) that works on any device with a modern browser - iOS, Android, Windows, Mac, or Linux. Install it on your phone's home screen for a native app experience, or use it in your browser on desktop. Pro users get cloud sync across all devices."
              },
              {
                question: "How long does it take to form a new habit?",
                answer: "Research shows habit formation takes anywhere from 18 to 254 days, with 66 days being the average. RESURGO supports you through this journey with streak tracking, AI coaching messages, progressive difficulty adjustments, and celebration milestones at 7, 21, 66, and 90 days to keep you motivated."
              },
              {
                question: "Can RESURGO help with fitness and health goals?",
                answer: "Absolutely! RESURGO is perfect for fitness goals like losing weight, building muscle, running a marathon, or establishing a workout routine. The AI breaks down your fitness goal into progressive milestones and daily habits, while tracking features help you monitor workout consistency, meal habits, sleep routines, and more."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden"
                itemScope 
                itemProp="mainEntity" 
                itemType="https://schema.org/Question"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="font-semibold text-left pr-4" itemProp="name">{faq.question}</h3>
                    <ChevronRight className="w-5 h-5 text-white/50 shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <div 
                    className="px-6 pb-6 text-white/70 text-sm leading-relaxed"
                    itemScope 
                    itemProp="acceptedAnswer" 
                    itemType="https://schema.org/Answer"
                  >
                    <p itemProp="text">{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 mb-6">
            <Zap className="w-4 h-4 text-gold-400" />
            <span className="text-sm text-gold-400 font-medium">Start Your Transformation Today</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Ready to <span className="text-ascend-400">RESURGO</span>?
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            Join thousands of achievers who have transformed their goals into reality. 
            Start for free, upgrade anytime.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-10 py-4 rounded-xl font-semibold text-lg
                       bg-gradient-to-r from-ascend-500 to-ascend-600 hover:from-ascend-400 hover:to-ascend-500
                       shadow-lg shadow-ascend-500/25 transition-all flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg
                         border border-white/10 hover:bg-white/5 transition-colors
                         flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Add to Homescreen
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Footer Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/billing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/guides" className="hover:text-white transition-colors">Guides</Link></li>
              </ul>
            </div>
            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li><a href="mailto:support@resurgo.life" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ascend-500 to-ascend-600 
                            flex items-center justify-center">
                <Mountain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">RESURGO</span>
            </div>
            <p className="text-sm text-white/40">
              � 2026 Resurgo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDemoModal(false)}
          />
          <div className="relative w-full max-w-4xl bg-[#141416] rounded-2xl border border-white/10 overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-semibold text-lg">See RESURGO in Action</h3>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Close demo modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Demo Content */}
            <div className="p-6 space-y-6">
              {/* Feature Walkthrough */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-ascend-500/10 to-transparent border border-ascend-500/20">
                  <div className="w-12 h-12 rounded-lg bg-ascend-500/20 flex items-center justify-center mb-3">
                    <Brain className="w-6 h-6 text-ascend-400" />
                  </div>
                  <h4 className="font-semibold mb-2">1. Set Your Goal</h4>
                  <p className="text-sm text-white/60">Tell us your ultimate goal, and our AI breaks it into daily actionable tasks.</p>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="font-semibold mb-2">2. Track Daily</h4>
                  <p className="text-sm text-white/60">Check off habits, earn XP, and watch your streaks grow day by day.</p>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-gold-400/10 to-transparent border border-gold-400/20">
                  <div className="w-12 h-12 rounded-lg bg-gold-400/20 flex items-center justify-center mb-3">
                    <Trophy className="w-6 h-6 text-gold-400" />
                  </div>
                  <h4 className="font-semibold mb-2">3. Level Up</h4>
                  <p className="text-sm text-white/60">Unlock achievements, level up your profile, and become who you want to be.</p>
                </div>
              </div>

              {/* Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-[#1a1a1c] to-[#0d0d0e] rounded-xl border border-white/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-ascend-500/20 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-ascend-500/30 transition-colors">
                    <Play className="w-8 h-8 text-ascend-400 ml-1" />
                  </div>
                  <p className="text-white/60 text-sm">Demo video coming soon</p>
                  <p className="text-white/40 text-xs mt-1">Try the app to see it in action!</p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowDemoModal(false);
                    onGetStarted();
                  }}
                  className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-ascend-500 to-ascend-600 
                           hover:from-ascend-400 hover:to-ascend-500 transition-all flex items-center justify-center gap-2"
                >
                  Start Free Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="px-8 py-3 rounded-xl font-semibold border border-white/10 hover:bg-white/5 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
