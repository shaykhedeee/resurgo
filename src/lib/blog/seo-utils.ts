export function generateFAQSchema(faqItems: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqItems.map((item) => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  slug: string,
  title: string,
  cluster?: { title: string; slug: string }
) {
  const elements = [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://resurgo.life/',
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Blog',
      'item': 'https://resurgo.life/blog',
    },
  ];

  if (cluster) {
    elements.push({
      '@type': 'ListItem',
      'position': 3,
      'name': cluster.title,
      'item': `https://resurgo.life/blog/topics/${cluster.slug}`,
    });
  }

  elements.push({
    '@type': 'ListItem',
    'position': cluster ? 4 : 3,
    'name': title,
    'item': `https://resurgo.life/blog/${slug}`,
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': elements,
  };
}

export function generateSpeakableSchema(title: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    'url': `https://resurgo.life/blog/${slug}`,
    'speakable': {
      '@type': 'SpeakableSpecification',
      'cssSelector': ['h1', '.prose p:first-of-type'],
    },
  };
}

export function generateHowToSchema(
  name: string,
  description: string,
  totalTime: string,
  steps: string[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': name,
    'description': description,
    'totalTime': totalTime,
    'step': steps.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'name': step,
      'text': step,
    })),
  };
}

export function generateBlogPostingSchema(post: {
  slug: string;
  title: string;
  desc: string;
  heroImage?: string;
  date: string;
  modifiedDate?: string;
  authorName: string;
  wordCount?: number;
  readTime?: string;
  articleSection?: string;
  tags?: string[];
  seoKeywords?: string[];
}) {
  const url = `https://resurgo.life/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': url,
    'headline': post.title,
    'description': post.desc,
    'image': post.heroImage ? [`https://resurgo.life${post.heroImage}`] : ['https://resurgo.life/images/blog-default.jpg'],
    'inLanguage': 'en-US',
    'wordCount': post.wordCount,
    ...(post.readTime ? { 'timeRequired': `PT${Math.max(parseInt(post.readTime, 10) || 1, 1)}M` } : {}),
    ...(post.articleSection ? { 'articleSection': post.articleSection } : {}),
    ...(post.tags ? { 'about': post.tags.map((tag) => ({ '@type': 'Thing', name: tag })) } : {}),
    'isAccessibleForFree': true,
    'author': {
      '@type': 'Person',
      'name': post.authorName,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Resurgo',
      'url': 'https://resurgo.life',
    },
    'datePublished': post.date,
    'dateModified': post.modifiedDate || post.date,
    'keywords': (post.seoKeywords ?? post.tags ?? []).join(', '),
  };
}


