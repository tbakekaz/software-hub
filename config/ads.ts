export type AdPosition =
  | 'global-header'
  | 'home-below-hero'
  | 'home-between-sections'
  | 'sidebar'
  | 'in-article'
  | 'footer'
  | 'list-inline'
  | 'detail-sidebar';

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
  },
  'list-inline': {
    enabled: false,
    variant: 'affiliate-card',
    url: '#'
  },
  'detail-sidebar': {
    enabled: false,
    variant: 'affiliate-card',
    url: '#'
  }
};

// List inline ad configuration (used by list pages to inject AdCard at fixed positions)
export const listInlineAd = {
  enabled: true,
  positions: [2, 8], // inject after 2nd and 8th cards
  payload: {
    variant: 'affiliate-card' as const,
    url: '#',
  },
  text: {
    tag: 'Sponsored',
    title: 'KazSoft 专属优惠',
    desc: '精选软件与服务的独家折扣，支持站点运营',
    href: 'https://kazsoft.dpdns.org/pricing'
  }
};

// Detail page sidebar ad configuration (optional)
export const detailSidebarAd = {
  enabled: false,
  payload: {
    variant: 'affiliate-card' as const,
    url: '#',
  },
  text: {
    tag: '推广',
    title: '升级为 Pro',
    desc: '解锁离线下载、收藏夹与无广告体验',
    href: 'https://kazsoft.dpdns.org/pricing'
  }
};
