/// <reference types="vite/client" />

declare global {
  interface Window {
    __TAURI__?: {
      core?: any;
    };
  }
}

export {};
