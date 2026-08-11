type AppEnvironment = 'development' | 'preview' | 'production';

function readEnvironment(value: string | undefined): AppEnvironment {
  if (value === 'preview' || value === 'production') {
    return value;
  }

  return 'development';
}

export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? '',
  environment: readEnvironment(process.env.EXPO_PUBLIC_ENVIRONMENT),
  isDevelopment: readEnvironment(process.env.EXPO_PUBLIC_ENVIRONMENT) === 'development',
} as const;
