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

export function generateBreadcrumbSchema(slug: string, title: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://resurgo.life',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Blog',
        'item': 'https://resurgo.life/blog',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': title,
        'item': `https://resurgo.life/blog/${slug}`,
      },
    ],
  };
}

export function generateSpeakableSchema(headline: string, summary: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': headline,
    'speakable': {
      '@type': 'SpeakableSpecification',
      'cssSelector': ['.speakable-summary', '.speakable-title'],
    },
    'description': summary,
  };
}

export function generateHowToSchema(steps: { name: string; text: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': 'How to implement this protocol',
    'step': steps.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'name': step.name,
      'text': step.text,
      ...(step.url ? { 'url': step.url } : {}),
    })),
  };
}
