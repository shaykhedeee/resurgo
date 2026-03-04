// -------------------------------------------------------------------------------
// RESURGO - Pixel Art Logo Component
// Standalone pixelated ascending arrow - no box, no border, pure arrow + glow
// -------------------------------------------------------------------------------

'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  animated?: boolean;
  glow?: boolean;
}

const sizeClasses = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const textSizeClasses = {
  sm: 'text-[0.55rem]',
  md: 'text-[0.65rem]',
  lg: 'text-[0.8rem]',
  xl: 'text-[1rem]',
};

// Redesigned pixel arrow - 16x16 grid, left-lit shading, no box
function PixelArrowSVG({
  className,
  animated,
  glow = true,
}: {
  className?: string;
  animated?: boolean;
  glow?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn('pixel-render', className)}
      style={{
        imageRendering: 'pixelated',
        filter: glow
          ? 'drop-shadow(0 0 3px rgba(249,115,22,0.95)) drop-shadow(0 0 7px rgba(249,115,22,0.55))'
          : undefined,
      }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* TIP - brightest highlight */}
      <rect x="7" y="0" width="2" height="2" fill="#FFEDD5" />

      {/* ROW 2 */}
      <rect x="6" y="2" width="4" height="2" fill="#FB923C" />

      {/* ROW 3 - shoulder start */}
      <rect x="5" y="4" width="1" height="2" fill="#FB923C" />
      <rect x="6" y="4" width="4" height="2" fill="#F97316" />
      <rect x="10" y="4" width="1" height="2" fill="#EA580C" />

      {/* ROW 4 */}
      <rect x="4" y="6" width="1" height="2" fill="#FDBA74" />
      <rect x="5" y="6" width="1" height="2" fill="#FB923C" />
      <rect x="6" y="6" width="4" height="2" fill="#EA580C" />
      <rect x="10" y="6" width="1" height="2" fill="#C2410C" />
      <rect x="11" y="6" width="1" height="2" fill="#9A3412" />

      {/* ROW 5 - widest point of arrowhead */}
      <rect x="2" y="8" width="2" height="2" fill="#FED7AA" />
      <rect x="4" y="8" width="2" height="2" fill="#FB923C" />
      <rect x="6" y="8" width="4" height="2" fill="#EA580C" />
      <rect x="10" y="8" width="2" height="2" fill="#C2410C" />
      <rect x="12" y="8" width="2" height="2" fill="#7C2D12" />

      {/* SHAFT - progressively darker left-to-right and top-to-bottom */}
      <rect x="6" y="10" width="1" height="2" fill="#FB923C" />
      <rect x="7" y="10" width="2" height="2" fill="#EA580C" />
      <rect x="9" y="10" width="1" height="2" fill="#C2410C" />

      <rect x="6" y="12" width="1" height="2" fill="#EA580C" />
      <rect x="7" y="12" width="2" height="2" fill="#C2410C" />
      <rect x="9" y="12" width="1" height="2" fill="#9A3412" />

      <rect x="6" y="14" width="1" height="2" fill="#C2410C" />
      <rect x="7" y="14" width="2" height="2" fill="#9A3412" />
      <rect x="9" y="14" width="1" height="2" fill="#7C2D12" />

      {/* SPECULAR GLINT - top-left corner pixels */}
      <rect x="7" y="0" width="1" height="1" fill="white" opacity="0.65" />
      <rect x="6" y="2" width="1" height="1" fill="white" opacity="0.25" />
      <rect x="4" y="8" width="1" height="1" fill="white" opacity="0.12" />

      {/* Optional animated shimmer sweep */}
      {animated && (
        <rect x="0" y="0" width="16" height="2" fill="white" opacity="0.07">
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0 -2"
            to="0 18"
            dur="2.5s"
            begin="0s"
            repeatCount="indefinite"
          />
        </rect>
      )}
    </svg>
  );
}

export function Logo({
  size = 'md',
  showText = false,
  className,
  animated = false,
  glow = true,
}: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Standalone pixel arrow - no box, no border */}
      <PixelArrowSVG
        className={sizeClasses[size]}
        animated={animated}
        glow={glow}
      />

      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              textSizeClasses[size],
              'font-pixel tracking-wider text-white leading-none uppercase',
            )}
            style={{ fontFamily: 'var(--font-pixel, "Press Start 2P"), monospace' }}
          >
            RESURGO
          </span>
          <span className="text-xs text-zinc-500 tracking-[0.12em] uppercase mt-1 font-mono">
            by WEBNESS
          </span>
        </div>
      )}
    </div>
  );
}

// Compact standalone arrow mark - no outer box
export function LogoMark({ className, glow = true }: { className?: string; glow?: boolean }) {
  return <PixelArrowSVG className={cn('pixel-render', className)} glow={glow} />;
}

// Loading spinner - arrow with bounce animation
export function LogoSpinner({ className }: { className?: string }) {
  return (
    <PixelArrowSVG
      className={cn('w-10 h-10 animate-pixel-bounce', className)}
      animated
      glow
    />
  );
}