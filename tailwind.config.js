/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand – Pixel Terminal: Rust × Black × Matrix
        ascend: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#EA580C', // primary CTA rust
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        rust: {
          400: '#FB923C',
          500: '#EA580C',
          600: '#C2410C',
          dim: '#431407',
        },
        terminal: {
          bg: '#000000',
          panel: '#09090B',
          border: '#18181B',
          muted: '#27272A',
        },
        // Pixel accent colors
        pixel: {
          green: '#00FF41',
          red: '#FF6B6B',
          yellow: '#FFD93D',
          blue: '#4D96FF',
          cyan: '#00D4FF',
          purple: '#A855F7',
        },
        // Status colors — pixel-aligned
        success: '#00FF41',
        warning: '#FFD93D',
        danger: '#FF6B6B',
        info: '#4D96FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
        terminal: ['"VT323"', 'monospace'],
        display: ['"Press Start 2P"', '"Cal Sans"', 'monospace'],
        mono: ['"VT323"', '"JetBrains Mono"', '"Fira Code"', '"Cascadia Code"', 'Consolas', 'monospace'],
      },
      fontSize: {
        // ── Standard scale — bumped for readability ──
        // (overrides Tailwind defaults: xs=12→14, sm=14→15, base=16→17, lg=18→19)
        'xs':   ['14px', { lineHeight: '1.5' }],
        'sm':   ['15px', { lineHeight: '1.5' }],
        'base': ['17px', { lineHeight: '1.6' }],
        'lg':   ['19px', { lineHeight: '1.5' }],
        'xl':   ['22px', { lineHeight: '1.4' }],
        '2xl':  ['26px', { lineHeight: '1.3' }],
        '3xl':  ['32px', { lineHeight: '1.2' }],
        '4xl':  ['40px', { lineHeight: '1.1' }],
        '5xl':  ['52px', { lineHeight: '1.05' }],
        '6xl':  ['64px', { lineHeight: '1' }],
        '7xl':  ['80px', { lineHeight: '1' }],
        '8xl':  ['96px', { lineHeight: '1' }],
        '9xl':  ['128px', { lineHeight: '1' }],
        // ── Pixel font sizes (Press Start 2P needs smaller sizes) ──
        'pixel-xs': ['0.625rem', { lineHeight: '1.6' }],
        'pixel-sm': ['0.7rem', { lineHeight: '1.5' }],
        'pixel-md': ['0.8rem', { lineHeight: '1.4' }],
        'pixel-lg': ['0.9rem', { lineHeight: '1.3' }],
        'pixel-xl': ['1rem', { lineHeight: '1.3' }],
        'pixel-2xl': ['1.25rem', { lineHeight: '1.2' }],
        // ── Terminal sizes (VT323 is taller) ──
        'terminal-sm': ['1rem', { lineHeight: '1.3' }],
        'terminal-md': ['1.2rem', { lineHeight: '1.3' }],
        'terminal-lg': ['1.5rem', { lineHeight: '1.2' }],
        'terminal-xl': ['2rem', { lineHeight: '1.2' }],
      },
      borderRadius: {
        'pixel': '2px',
        'none': '0px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s steps(6, end)',
        'scale-in': 'scaleIn 0.2s steps(4, end)',
        'flicker': 'flicker 4s steps(8) infinite',
        'blink': 'blink 1s steps(2) infinite',
        'scanline': 'scanline 8s steps(60) infinite',
        'glow': 'pixelGlow 2s steps(6) infinite alternate',
        'level-up': 'levelUp 0.6s steps(8) forwards',
        'type-in': 'typeIn 0.4s steps(20, end)',
        'pixel-bounce': 'pixelBounce 0.5s steps(4) infinite',
        'pixel-pulse': 'pixelPulse 2s steps(4) infinite',
        'matrix-rain': 'matrixRain 10s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '8%': { opacity: '0.93' },
          '9%': { opacity: '1' },
          '42%': { opacity: '1' },
          '43%': { opacity: '0.88' },
          '44%': { opacity: '1' },
          '76%': { opacity: '1' },
          '77%': { opacity: '0.92' },
          '78%': { opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pixelGlow: {
          '0%': { boxShadow: '0 0 0 1px rgba(234, 88, 12, 0.3), 2px 2px 0 rgba(234, 88, 12, 0.2)' },
          '100%': { boxShadow: '0 0 0 2px rgba(234, 88, 12, 0.5), 3px 3px 0 rgba(234, 88, 12, 0.4)' },
        },
        levelUp: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        typeIn: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        pixelBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        pixelPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        matrixRain: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      boxShadow: {
        // Pixel-style hard-edge shadows
        'pixel-sm': '2px 2px 0px rgba(0, 0, 0, 0.7)',
        'pixel-md': '3px 3px 0px rgba(0, 0, 0, 0.8)',
        'pixel-lg': '4px 4px 0px rgba(0, 0, 0, 0.8)',
        'pixel-xl': '5px 5px 0px rgba(0, 0, 0, 0.9)',
        // Colored pixel shadows
        'rust-sm': '0 0 0 1px rgba(234, 88, 12, 0.3), 2px 2px 0 rgba(234, 88, 12, 0.2)',
        'rust-md': '0 0 0 1px rgba(234, 88, 12, 0.4), 3px 3px 0 rgba(234, 88, 12, 0.3)',
        'rust-lg': '0 0 0 2px rgba(234, 88, 12, 0.5), 4px 4px 0 rgba(234, 88, 12, 0.4)',
        'glow-sm': '0 0 0 1px rgba(234, 88, 12, 0.3), 2px 2px 0 rgba(234, 88, 12, 0.2)',
        'glow-md': '0 0 0 1px rgba(234, 88, 12, 0.4), 3px 3px 0 rgba(234, 88, 12, 0.3)',
        'glow-lg': '0 0 0 2px rgba(234, 88, 12, 0.5), 4px 4px 0 rgba(234, 88, 12, 0.4)',
        'pixel-green': '0 0 0 1px rgba(0, 255, 65, 0.4), 2px 2px 0 rgba(0, 255, 65, 0.2)',
        'pixel-yellow': '0 0 0 1px rgba(255, 217, 61, 0.4), 2px 2px 0 rgba(255, 217, 61, 0.2)',
        'pixel-blue': '0 0 0 1px rgba(77, 150, 255, 0.4), 2px 2px 0 rgba(77, 150, 255, 0.2)',
        'panel': 'inset 0 1px 0 rgba(255,255,255,0.03)',
      },
    },
  },
  plugins: [],
}
