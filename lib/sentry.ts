// lib/sentry.ts
import * as Sentry from "@sentry/nextjs";

export const initSentry = () => {
  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  }
};

export const trackEvent = (event: string, properties?: any) => {
  if (process.env.NODE_ENV === "production") {
    Sentry.captureMessage(event, {
      level: "info",
      extra: properties,
    });
  }
};