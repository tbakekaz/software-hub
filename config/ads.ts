export type AdPosition =
  | 'global-header'
  | 'home-below-hero'
  | 'home-between-sections'
  | 'sidebar'
  | 'in-article'
  | 'footer';

export type AdItem = {
  enabled: boolean;
  variant: 'image' | 'html' | 'script' | 'affiliate-card';
  dismissible?: boolean; // remember hidden for 7 days
  url?: string; // for image/affiliate
  img?: { src: string; alt?: string; width?: number; height?: number };
  html?: string;
  script?: string;
  // AdSense specific
  adSlot?: string;
  adFormat?: string;
  responsive?: boolean;
};

export const adsConfig: Record<AdPosition, AdItem> = {
  'global-header': {
    enabled: true,
    variant: 'image',
    dismissible: true,
    url: '#',
    img: { src: '/ads/header.svg', alt: 'Header Banner' }
  },
  'home-below-hero': {
    enabled: true,
    variant: 'image',
    url: '#',
    img: { src: '/ads/home.svg', alt: 'Home Banner' }
  },
  'home-between-sections': {
    enabled: true,
    variant: 'image',
    url: '#',
    img: { src: '/ads/between.svg', alt: 'Between Sections' }
  },
  sidebar: {
    enabled: true,
    variant: 'image',
    url: '#',
    img: { src: '/ads/sidebar.svg', alt: 'Sidebar Ad' }
  },
  'in-article': {
    enabled: true,
    variant: 'affiliate-card'
  },
  footer: {
    enabled: false,
    variant: 'image',
    url: '#',
    img: { src: 'https://via.placeholder.com/1200x80?text=Footer+Banner', alt: 'Footer Banner' }
  }
};


