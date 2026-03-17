import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/assets/images/**',
        search: '',
      },
    ],
    remotePatterns: [...getServerImagePattern()],
  },
  reactStrictMode: true,

  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src')],
    prependData: `
      @import "@/assets/styles/root/variables";
      @import "@/assets/styles/root/mixins";
    `,
  },

  webpack(config) {
    config?.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

function getServerImagePattern() {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) return [];

  try {
    const url = new URL(process.env.NEXT_PUBLIC_API_BASE_URL);
    const hostname = url.hostname;
    return [
      {
        hostname: hostname,
        pathname: '/**',
        port: '',
        protocol: 'https',
        search: '',
      },
    ];
  } catch (_error) {
    return [];
  }
}

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
