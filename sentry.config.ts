import * as Sentry from '@sentry/nextjs';
const { NODE_ENV } = process.env;

export const init = () =>
  Sentry.init({
    // Should add your own dsn
    dsn: 'https://0bb207e6cd9e9174a0bcdfe3d48699aa@o4507576884658176.ingest.us.sentry.io/4507576887410688',
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 0.1,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps

    // Replay may only be enabled for the client-side

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    autoSessionTracking: true,
    beforeSend(event) {
      if (NODE_ENV === 'development') {
        return null;
      }
      return event;
    },
  });
