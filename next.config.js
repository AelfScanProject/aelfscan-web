/*
 * @Author: aelf-lxy
 * @Date: 2023-08-02 01:50:01
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 14:19:21
 * @Description: next config
 */
/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPlugins = require('next-compose-plugins');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluginConfig = require('./build.config/plugin');

const nextConfig = {
  compiler: {
    // to solve the problem: https://github.com/vercel/next.js/discussions/60150
    // https://nextjs.org/docs/architecture/nextjs-compiler#styled-components
    styledComponents: {
      ssr: true,
    },
  },
  reactStrictMode: false,
  experimental: {
    proxyTimeout: 30000,
    staleTimes: {
      dynamic: 1,
      static: 1,
    },
  },
  async rewrites() {
    return process.env.NODE_ENV === 'production'
      ? []
      : [
          {
            source: '/home',
            destination: '/',
            // permanent: false,
          },
          // {
          //   source: '/api/:path*',
          //   destination: 'https://aelfscan.io/api/:path*',
          //   // permanent: false,
          //   // basePath: false,
          // },
          {
            source: '/api/:path*',
            destination: 'https://testnet.aelfscan.io/api/:path*',
            // permanent: false,
            // basePath: false,
          },
          {
            source: '/chain/:path*',
            destination: 'http://localhost:3001/chain/:path*',
            // permanent: false,
          },
          {
            source: '/cms/:path*',
            destination: 'http://localhost:3001/cms/:path*',
            // permanent: false,
          },
          {
            source: '/new-socket/:path*',
            destination: 'http://localhost:3001/new-socket/:path*',
            // permanent: false,
          },
          {
            source: '/Portkey_DID/:path*',
            destination: 'http://localhost:3001/Portkey_DID/:path*',
            // permanent: false,
          },
          {
            source: '/Portkey_V2_DID/:path*',
            destination: 'http://localhost:3001/Portkey_V2_DID/:path*',
            // permanent: false,
          },
          // {
          //   source: '/v1/api/:path*',
          //   destination: 'http://localhost:3001/v1/api/:path*',
          //   // permanent: false,
          // },
          // {
          //   source: '/v2/api/:path*',
          //   destination: 'http://localhost:3001/v2/api/:path*',
          //   // permanent: false,
          // },
        ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  productionBrowserSourceMaps: true,
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.proto$/,
      use: 'protobufjs-loader',
    });

    if (!isServer) {
      config.devtool = 'source-map';
    }

    return config;
  },
  output: 'standalone',
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = withPlugins(pluginConfig, nextConfig);
