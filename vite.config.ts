import { lingui } from '@lingui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  const proxy =
    env.VITE_USE_PROXY === 'true'
      ? {
          '/api': {
            target: env.VITE_SERVER,
            changeOrigin: true,
            rewrite: (path) => path,
          },
          // '^/api/workspaces/.+/events': {
          //   target: env.VITE_WS_SERVER,
          //   changeOrigin: true,
          //   ws: true,
          //   rewrite: (path) => path,
          // },
        }
      : undefined
  return {
    plugins: [react({ plugins: [['@lingui/swc-plugin', {}]] }), svgr(), lingui()],
    // build: {
    //   manifest: '/public/manifest.json',
    // },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
    server: {
      port: Number(env.PORT),
      host: env.HOST,
      proxy,
    },
    resolve: {
      alias: [{ find: 'src', replacement: path.resolve(__dirname, 'src') }],
    },
  }
})
