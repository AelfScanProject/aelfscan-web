const { NODE_ENV } = process.env;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
  include: '.next',
  configFile: '.sentryclirc',
  urlPrefix: '~/_next',
  org: 'aelfscan',
  project: 'aelfscan-web',
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = [
  (nextConfig) => (NODE_ENV === 'development' ? nextConfig : withSentryConfig(nextConfig, sentryWebpackPluginOptions)),
];
