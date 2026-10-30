/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Fallback APK link, used when the admin hasn't set one on the server. Baked in at build time. */
  readonly VITE_APK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
