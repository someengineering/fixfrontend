import { lingui } from '@lingui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { PluginOption, ProxyOptions, defineConfig, loadEnv } from 'vite'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  const plugins: PluginOption = [react({ plugins: [['@lingui/swc-plugin', {}]] }), svgr(), lingui()]

  if (env.VITE_USE_MOCK === 'true') {
    plugins.push(
      mockDevServerPlugin({
        prefix: '/api',
        wsPrefix: '^/api/workspaces/[a-z0-9\\-]+/events',
        include: ['mock-apis/**/*.mock.ts'],
        log: 'debug',
        build: {
          log: 'debug',
        },
      }),
    )
  }

  const proxy: Record<string, string | ProxyOptions> =
    env.VITE_USE_PROXY === 'true'
      ? {
          '/api': {
            target: env.VITE_SERVER,
            changeOrigin: true,
          },
          [`^/api/workspaces/[a-z0-9\\-]+/events`]: {
            target: env.VITE_WS_SERVER,
            changeOrigin: true,
            ws: true,
          },
        }
      : undefined

  const serverOptions = {
    port: env.PORT ? Number(env.PORT) : undefined,
    host: env.HOST ?? undefined,
    proxy,
  }

  return {
    base: process.env.PUBLIC_URL ?? '/',
    plugins,
    build: {
      //   manifest: '/public/manifest.json',
      sourcemap: true,
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === 'SOURCEMAP_ERROR') {
            return
          }

          defaultHandler(warning)
        },
      },
    },
    server: serverOptions,
    preview: serverOptions,
    resolve: {
      alias: [{ find: 'src', replacement: path.resolve(__dirname, 'src') }],
    },
  }
})
