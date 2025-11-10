export function softwareSchema(data: { name: string; url: string; version?: string; operatingSystems?: string[]; description?: string; image?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: data.name,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: data.operatingSystems?.join(', '),
    url: data.url,
    softwareVersion: data.version,
    description: data.description,
    image: data.image,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };
}

export function articleSchema(data: { title: string; url: string; datePublished: string; description?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    url: data.url,
    datePublished: data.datePublished,
    description: data.description
  };
}

export function websiteSchema(data: { name: string; url: string; description?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    description: data.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${data.url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function organizationSchema(data: { name: string; url: string; logo?: string; description?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function howToSchema(data: { name: string; description?: string; steps: Array<{ title: string; text: string }>; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name,
    description: data.description,
    url: data.url,
    step: data.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.text,
    })),
  };
}

export function reviewSchema(data: { name: string; url: string; ratingValue: number; reviewCount?: number; author: string; reviewBody?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'CreativeWork',
      name: data.name,
      url: data.url,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: data.ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      '@type': 'Person',
      name: data.author,
    },
    reviewBody: data.reviewBody,
    aggregateRating: data.reviewCount
      ? {
          '@type': 'AggregateRating',
          ratingValue: data.ratingValue,
          reviewCount: data.reviewCount,
        }
      : undefined,
  };
}




