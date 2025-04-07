import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
    ];
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              connect-src 'self' https://api.stripe.com http://localhost:3001;
              script-src 'self' https://js.stripe.com https://m.stripe.network 'unsafe-inline';
              frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
              img-src 'self' data:;
              style-src 'self' 'unsafe-inline';
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ];
  }
};

export default nextConfig;