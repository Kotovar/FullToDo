/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vitest/browser" />

interface ImportMetaEnv {
  readonly VITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
