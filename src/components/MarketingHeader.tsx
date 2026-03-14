import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/Logo';
import { PixelIcon, type PixelIconName } from '@/components/PixelIcon';

type MarketingNavLink = {
	href: string;
	label: string;
	icon?: PixelIconName;
};

const DEFAULT_NAV_LINKS: Array<MarketingNavLink> = [
	{ href: '/features', label: 'Features', icon: 'grid' },
	{ href: '/pricing', label: 'Pricing', icon: 'star' },
	{ href: '/download', label: 'Download', icon: 'dashboard' },
	{ href: '/blog', label: 'Blog', icon: 'terminal' },
	{ href: '/docs', label: 'Docs', icon: 'plan' },
];

interface MarketingHeaderProps {
	navLinks?: Array<MarketingNavLink>;
	tickerText?: string;
	secondaryCtaHref?: string;
	secondaryCtaLabel?: string;
	primaryCtaHref?: string;
	primaryCtaLabel?: string;
	className?: string;
}

export function MarketingHeader({
	navLinks = DEFAULT_NAV_LINKS,
	tickerText = 'RESURGO.life :: PIXEL_EXECUTION_LAYER_ACTIVE :: ALL_SYSTEMS_NOMINAL',
	secondaryCtaHref = '/sign-in',
	secondaryCtaLabel = 'Sign In',
	primaryCtaHref = '/sign-up',
	primaryCtaLabel = 'Get Started',
	className,
}: MarketingHeaderProps) {
	return (
		<header className={cn('sticky top-0 z-50 border-b border-zinc-900 bg-black', className)}>
			<div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
				<Link href="/" className="flex items-center gap-3">
					<LogoMark className="h-8 w-8" />
					<div className="hidden sm:block">
						<span className="block font-pixel text-base tracking-[0.2em] text-orange-500">RESURGO</span>
						<span className="block font-terminal text-[11px] text-zinc-600">life operating system</span>
					</div>
				</Link>

				<nav className="hidden items-center gap-1 lg:flex">
					{navLinks.map(({ href, label, icon = 'grid' }) => (
						<Link
							key={`${href}-${label}`}
							href={href}
							className="inline-flex items-center gap-2 border border-transparent px-3 py-2 font-mono text-sm text-zinc-400 transition-colors hover:border-zinc-800 hover:text-orange-400"
						>
							<PixelIcon name={icon} size={12} className="text-orange-500/80" />
							<span>{label}</span>
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-3">
					<Link
						href={secondaryCtaHref}
						className="hidden sm:inline-flex items-center gap-1.5 border border-zinc-600 bg-zinc-900 px-4 py-1.5 font-mono text-sm text-zinc-200 transition hover:border-orange-500 hover:bg-black hover:text-orange-400"
					>
						{secondaryCtaLabel}
					</Link>
					<Link
						href={primaryCtaHref}
						className="inline-flex items-center gap-2 border border-orange-600 bg-orange-950/30 px-4 py-1.5 font-mono text-sm font-bold text-orange-500 transition hover:bg-orange-600 hover:text-black"
					>
						<PixelIcon name="arrow-right" size={12} />
						<span>{primaryCtaLabel}</span>
					</Link>
				</div>
			</div>

			<div className="border-t border-zinc-900 bg-zinc-950 overflow-hidden py-1">
				<div className="flex whitespace-nowrap" style={{ animation: 'ticker-scroll 35s linear infinite' }}>
					{[0,1].map((idx) => (
						<span key={idx} className="inline-flex shrink-0 items-center gap-6 pr-16 font-mono text-[10px] tracking-widest text-zinc-300">
							<PixelIcon name="terminal" size={11} className="text-orange-500 shrink-0" />
							<span className="text-orange-600/70">★</span>
							<span>{tickerText}</span>
							<span className="text-zinc-700">·</span>
							<span className="text-orange-600/50">FREE FOREVER TIER</span>
							<span className="text-zinc-700">·</span>
							<span>8 AI COACHES AVAILABLE</span>
							<span className="text-zinc-700">·</span>
							<span className="text-orange-600/50">NO APP STORE REQUIRED</span>
							<span className="text-zinc-700">·</span>
						</span>
					))}
				</div>
				<style>{`
					@keyframes ticker-scroll {
						0%   { transform: translateX(0); }
						100% { transform: translateX(-50%); }
					}
				`}</style>
			</div>

			<nav className="border-t border-zinc-900 bg-black px-3 py-2 lg:hidden">
				<div className="flex gap-2 overflow-x-auto pb-1">
					{navLinks.map(({ href, label, icon = 'grid' }) => (
						<Link
							key={`mobile-${href}-${label}`}
							href={href}
							className="inline-flex shrink-0 items-center gap-2 border border-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-zinc-600 hover:text-orange-400"
						>
							<PixelIcon name={icon} size={10} className="text-orange-500/80" />
							<span>{label}</span>
						</Link>
					))}
				</div>
			</nav>
		</header>
	);
}
