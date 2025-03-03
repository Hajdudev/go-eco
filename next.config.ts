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
};

export default nextConfig;
