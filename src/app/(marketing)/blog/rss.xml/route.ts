import { BLOG_POST_INDEX } from '@/lib/blog/post-index';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc2822(dateInput: string): string {
  const parsed = new Date(dateInput);
  return Number.isNaN(parsed.getTime()) ? new Date().toUTCString() : parsed.toUTCString();
}

function toIso(dateInput: string): string {
  const parsed = new Date(dateInput);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function sanitizeCdata(value: string): string {
  return value.replace(/\]\]>/g, ']]&gt;');
}

export async function GET() {
  const site = 'https://resurgo.life';
  const pubDate = new Date().toUTCString();
  const latestIso = BLOG_POST_INDEX
    .map((post) => post.lastModified ?? post.date)
    .map((dateValue) => toIso(dateValue))
    .sort((a, b) => (a < b ? 1 : -1))[0] ?? new Date().toISOString();

  const items = BLOG_POST_INDEX.map((post, index) => {
    const link = `${site}/blog/${post.slug}`;
    const articleDate = post.lastModified ?? post.date;
    const articleJsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: post.title,
          description: post.desc,
          datePublished: toIso(post.date),
          dateModified: toIso(articleDate),
          image: `${site}${post.heroImage}`,
          url: link,
          author: { '@type': 'Organization', name: 'Resurgo Editorial Team' },
          publisher: { '@type': 'Organization', name: 'Resurgo', url: site },
          keywords: post.tags.join(', '),
        },
        {
          '@type': 'ListItem',
          position: index + 1,
          name: post.title,
          url: link,
        },
      ],
    };

    const encodedContent = sanitizeCdata(
      `<article><h1>${escapeXml(post.title)}</h1><p>${escapeXml(post.desc)}</p><p><strong>Read time:</strong> ${escapeXml(post.readTime)}</p><p><strong>Tags:</strong> ${escapeXml(post.tags.join(', '))}</p><script type="application/ld+json">${JSON.stringify(articleJsonLd)}</script></article>`
    );

    const categories = post.tags
      .map((tag) => `<category>${escapeXml(tag)}</category>`)
      .join('');

    return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${link}</link>
        <guid isPermaLink="true">${link}</guid>
        <description>${escapeXml(post.desc)}</description>
        <pubDate>${toRfc2822(post.date)}</pubDate>
        <dc:creator>Resurgo Editorial Team</dc:creator>
        ${categories}
        <resurgo:itemListPosition>${index + 1}</resurgo:itemListPosition>
        <resurgo:dateModified>${escapeXml(toIso(articleDate))}</resurgo:dateModified>
        <content:encoded><![CDATA[${encodedContent}]]></content:encoded>
      </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:resurgo="https://resurgo.life/ns/rss">
  <channel>
    <title>Resurgo Blog</title>
    <link>${site}/blog</link>
    <description>Evidence-based guides on habits, focus, goals, AI coaching, and execution systems.</description>
    <language>en-us</language>
    <generator>Resurgo Next.js Feed Generator</generator>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="${site}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <resurgo:itemListType>ItemList</resurgo:itemListType>
    <resurgo:latestArticleModified>${escapeXml(latestIso)}</resurgo:latestArticleModified>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    },
  });
}
