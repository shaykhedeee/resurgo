'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating?: number;
}

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
  autoPlay?: boolean;
  intervalMs?: number;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Resurgo completely changed how I approach my goals. The AI coaching feels like having a personal trainer for your productivity.',
    name: 'Alex Rivera',
    role: 'Full-Stack Developer',
    rating: 5,
  },
  {
    quote: 'I have tried dozens of habit trackers. Resurgo is the first one that actually helped me build habits that lasted.',
    name: 'Priya Mehta',
    role: 'Designer & Founder',
    rating: 5,
  },
  {
    quote: 'The streak system is incredibly motivating. I am at 90 days and I have never felt more in control of my life.',
    name: 'Jordan Okafor',
    role: 'Remote Engineer',
    rating: 5,
  },
  {
    quote: 'Resurgo gamification made habit building feel like a game. I look forward to completing my habits every day.',
    name: 'Emma Larsson',
    role: 'Product Manager',
    rating: 5,
  },
];

export function TestimonialCarousel({
  testimonials = DEFAULT_TESTIMONIALS,
  autoPlay = true,
  intervalMs = 5000,
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[activeIndex];

  return (
    <section className="w-full py-20 overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          What builders are saying
        </h2>
        <p className="text-lg text-zinc-400 text-center mb-12">Real results from real people</p>

        <div className="relative">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-12 text-center">
            <Quote className="w-10 h-10 text-orange-500/30 mx-auto mb-6" />
            {current.rating && (
              <div className="flex gap-1 justify-center mb-4">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
            )}
            <p className="text-lg text-zinc-300 italic mb-6 leading-relaxed">&ldquo;{current.quote}&rdquo;</p>
            <p className="font-semibold text-white">{current.name}</p>
            <p className="text-sm text-zinc-500">{current.role}</p>
          </div>

          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === activeIndex ? 'bg-orange-500' : 'bg-zinc-700 hover:bg-zinc-600'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
