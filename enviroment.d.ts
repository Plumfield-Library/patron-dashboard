declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_TOKEN: string;
      SMTP_HOST: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      STRIPE_KEY: string;
      TURSO_URL: string;
      TURSO_KEY: string;
    }
  }
}

// Ensure this file is treated as a module
export {};
