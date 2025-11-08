export function softwareSchema(data: { name: string; url: string; version?: string; operatingSystems?: string[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: data.name,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: data.operatingSystems?.join(', '),
    url: data.url,
    softwareVersion: data.version
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

export function websiteSchema(data: { name: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url
  };
}




