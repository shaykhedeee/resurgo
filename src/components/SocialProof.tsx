'use client';

import { Star, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  rating?: number;
}

interface SocialProofProps {
  testimonials?: Testimonial[];
  heading?: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Resurgo helped me go from 0 productive habits to a 30-day streak in just 6 weeks. The AI coaching is incredible.',
    name: 'Sarah Chen',
    role: 'Software Engineer',
    rating: 5,
  },
  {
    quote: 'The goal decomposition feature changed how I approach work. I used to feel overwhelmed — now every day feels purposeful.',
    name: 'Marcus Johnson',
    role: 'Remote Developer',
    rating: 5,
  },
  {
    quote: 'Finally an app that combines Atomic Habits science with modern AI. My streak is at 67 days and climbing.',
    name: 'Aisha Patel',
    role: 'Product Manager',
    rating: 5,
  },
];

export function SocialProof({
  testimonials = DEFAULT_TESTIMONIALS,
  heading = 'Loved by builders, habit-hackers, and productivity enthusiasts',
}: SocialProofProps) {
  return (
    <section className="w-full py-20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-orange-400 font-medium mb-2">{heading}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          What our users are saying
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-zinc-600 mb-3" />
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="font-medium text-white text-sm">{testimonial.name}</p>
              <p className="text-xs text-zinc-500">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
