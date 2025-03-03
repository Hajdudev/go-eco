import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/find',
        permanent: true,
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
