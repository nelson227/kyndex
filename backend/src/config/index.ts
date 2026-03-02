export const appConfig = () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000'),
  API_PREFIX: process.env.API_PREFIX || 'api/v1',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
});

export const jwtConfig = () => ({
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
});

export const databaseConfig = () => ({
  url: process.env.DATABASE_URL,
});

export const redisConfig = () => ({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
});

export const stripeConfig = () => ({
  secretKey: process.env.STRIPE_SECRET_KEY,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
});

export const oauthConfig = () => ({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/oauth/google/callback',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/oauth/github/callback',
  },
});

export const emailConfig = () => ({
  provider: process.env.EMAIL_PROVIDER || 'sendgrid',
  apiKey: process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY,
  fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@kyndex.com',
  fromName: process.env.SENDGRID_FROM_NAME || 'Kyndex',
});
