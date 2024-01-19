import { lingui } from '@lingui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: process.env.PUBLIC_URL ?? '/',
    plugins: [
      react({ plugins: [['@lingui/swc-plugin', {}]] }),
      svgr(),
      lingui(),
      mockDevServerPlugin({
        prefix: '/api',
        wsPrefix: '^/api/workspaces/[a-z0-9\\-]+/events',
        include: ['mock-apis/**/*.mock.ts'],
        log: 'debug',
        build: {
          log: 'debug',
          serverPort: Number(env.PORT),
        },
      }),
    ],
    // build: {
    //   manifest: '/public/manifest.json',
    // },
    test: {
      globals: true,
      environment: 'node',
      transformMode: { web: [/.[tj]sx$/] },
      setupFiles: './src/setupTests.ts',
      coverage: {
        reporter: ['text', 'json', 'html'],
        include: ['src/**'],
        exclude: ['src/shared/constants/**'],
      },
      server: {
        debug: true,
      },
    },
    server: {
      port: Number(env.PORT),
      host: env.HOST,
      proxy: {
        '/api': {
          target: env.VITE_SERVER,
          changeOrigin: true,
        },
        [`^/api/workspaces/[a-z0-9\\-]+/events`]: {
          target: env.VITE_WS_SERVER,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    preview: {
      port: Number(env.PORT),
      host: env.HOST,
      proxy: {
        '/api': {
          target: env.VITE_SERVER,
          changeOrigin: true,
        },
        [`^/api/workspaces/[a-z0-9\\-]+/events`]: {
          target: env.VITE_WS_SERVER,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    resolve: {
      alias: [{ find: 'src', replacement: path.resolve(__dirname, 'src') }],
    },
  }
})
