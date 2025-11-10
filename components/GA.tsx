"use client";
import Script from 'next/script';

declare global {
  interface Window {
    dataLayer?: any[];
    adsbygoogle?: any[];
  }
}

export default function GA() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  if (!gaId && !adsenseId) return null;

  return (
    <>
      {gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
          <Script id="ga4" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments)}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {adsenseId ? (
        <Script
          id="adsense-main"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
          onLoad={() => {
            if (typeof window !== 'undefined' && !window.adsbygoogle) {
              window.adsbygoogle = [];
            }
          }}
        />
      ) : null}
    </>
  );
}




