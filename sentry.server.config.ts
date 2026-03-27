import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust sample rate in production — 1.0 = 100% of transactions
  tracesSampleRate: 1,

  // Only print debug in development
  debug: false,
});
