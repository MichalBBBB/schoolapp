declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCES_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      DATABASE_URL: string;
      PORT: string;
    }
  }
}

export {}
