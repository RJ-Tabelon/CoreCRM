/* global process */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Backend base (for dev proxy). Defaults to the backend's default port.
  const backendOrigin = env.VITE_BACKEND_ORIGIN || 'http://localhost:3000';

  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']]
        }
      }),
      tailwindcss()
    ],
    server: {
      proxy: {
        // Cookie-based auth uses SameSite=strict; proxying keeps requests same-origin.
        '/api': {
          target: backendOrigin,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
