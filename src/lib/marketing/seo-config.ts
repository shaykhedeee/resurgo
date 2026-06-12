export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'https://resurgo.life'
).replace(/\/$/, '');

export async function pingSearchEngines(sitemapUrl?: string): Promise<{ google: boolean; bing: boolean }> {
  const targetSitemap = sitemapUrl || `${siteUrl}/sitemap.xml`;
  const googlePing = `https://www.google.com/ping?sitemap=${encodeURIComponent(targetSitemap)}`;
  const bingPing = `https://www.bing.com/ping?sitemap=${encodeURIComponent(targetSitemap)}`;

  const results = { google: false, bing: false };

  try {
    const res = await fetch(googlePing, {
      method: 'GET',
      headers: {
        'User-Agent': 'ResurgoBot/1.0 (+https://resurgo.life)',
      },
    });
    results.google = res.ok;
    console.log(`[SEO] Google sitemap ping response: ${res.status}`);
  } catch (err) {
    console.error('[SEO] Google sitemap ping failed:', err);
  }

  try {
    const res = await fetch(bingPing, {
      method: 'GET',
      headers: {
        'User-Agent': 'ResurgoBot/1.0 (+https://resurgo.life)',
      },
    });
    results.bing = res.ok;
    console.log(`[SEO] Bing sitemap ping response: ${res.status}`);
  } catch (err) {
    console.error('[SEO] Bing sitemap ping failed:', err);
  }

  return results;
}
