export const preconnectLinks = [
  { rel: 'preconnect', href: 'https://consent.cookiebot.com' },
  { rel: 'dns-prefetch', href: 'https://consent.cookiebot.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
  { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
  { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
  { rel: 'preconnect', href: 'https://connect.facebook.net' },
  { rel: 'dns-prefetch', href: 'https://connect.facebook.net' },
  { rel: 'preconnect', href: 'https://www.google-analytics.com' },
  { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
  { rel: 'preconnect', href: 'https://www.clarity.ms' },
  { rel: 'dns-prefetch', href: 'https://www.clarity.ms' },
  { rel: 'preconnect', href: 'https://images.ctfassets.net' },
  { rel: 'dns-prefetch', href: 'https://images.ctfassets.net' },
  { rel: 'preconnect', href: `${process.env.CLOUDFRONT_INSTANCE}` },
  { rel: 'dns-prefetch', href: `${process.env.CLOUDFRONT_INSTANCE}` }
]
