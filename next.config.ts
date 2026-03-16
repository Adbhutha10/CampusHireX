import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  reactCompiler: true,
};

export default withSentryConfig(nextConfig, {
  // Suppresses source map uploading logs during build
  silent: true,
  org: "adbhutha",
  project: "javascript-nextjs",
  // Upload source maps to Sentry for readable stack traces
  widenClientFileUpload: true,
  // Disable the Sentry telemetry
  telemetry: false,
});
