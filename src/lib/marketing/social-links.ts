export const MARKETING_SOCIAL_LINKS = [
  { icon: '𝕏', label: 'Twitter', href: 'https://x.com/resurgo_life' },
  { icon: 'in', label: 'LinkedIn', href: 'https://www.linkedin.com/company/resurgo-life' },
  { icon: 'PH', label: 'Product Hunt', href: 'https://www.producthunt.com/products/resurgo' },
  { icon: 'DC', label: 'Discord', href: 'https://discord.gg/yrTQBXmf' },
  { icon: 'r/', label: 'Reddit', href: 'https://www.reddit.com/user/Resurgo_life/' },
  { icon: 'IG', label: 'Instagram', href: 'https://instagram.com/resurgo.life' },
] as const;

export const MARKETING_SOCIAL_URLS = MARKETING_SOCIAL_LINKS.map((link) => link.href);
