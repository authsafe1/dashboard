/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_URL: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_DOCS_URL: string;
  readonly VITE_RAZORPAY_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
