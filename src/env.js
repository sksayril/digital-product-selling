import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    MONGODB_URI: process.env.NODE_ENV === "production"
        ? z.string().url()
        : z.string().url().optional().default("mongodb://localhost:27017/digital-products"),
    RAZORPAY_KEY_ID: process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional().default("rzp_test_placeholder"),
    RAZORPAY_KEY_SECRET: process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional().default("razorpay_secret_placeholder"),
    ADMIN_USERNAME: process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional().default("admin"),
    ADMIN_PASSWORD: process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional().default("admin123"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional().default("rzp_test_placeholder"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION || process.env.SKIP_ENV_VALIDATION === 'true',
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
